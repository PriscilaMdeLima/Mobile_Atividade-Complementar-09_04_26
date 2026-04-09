import { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Platform, StatusBar as RNStatusBar, Image, Pressable, ActivityIndicator, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import TaskList from './src/components/TaskList';
import { addTask, deleteTask, getAllTasks, updateTask, TaskItem } from './src/utils/handle-api';
import { globalStyles } from './src/styles/global';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [priority, setPriority] = useState<'Baixa' | 'Média' | 'Alta'>('Baixa');

  useEffect(() => {
    getAllTasks(setTasks, setLoading);
  }, []);

  const resetForm = () => {
    setText("");
    setCompleted(false);
    setDueDate(null);
    setIsUpdating(false);
    setTaskId("");
    setPriority('Baixa');
    setModalVisible(false);
  };

  // Filtrar tarefas baseado no filtro selecionado
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed === true);
      case 'pending':
        return tasks.filter(task => task.completed !== true);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const updateMode = (task: TaskItem) => {
    setIsUpdating(true);
    setTaskId(task._id);
    setText(task.text);
    setCompleted(!!task.completed);
    setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setModalVisible(true);
  };

  const handleSave = () => {
    const formattedDate = dueDate ? dueDate.toISOString() : null;
    if (isUpdating) {
      updateTask(taskId, text, completed, formattedDate, setTasks, resetForm);
    } else {
      addTask(text, completed, formattedDate, setTasks, resetForm);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { backgroundColor: globalStyles.backgroundColor }]}>
        <View style={styles.headerContainer}>
          {!logoError ? (
            <Image 
              source={require('./assets/task-app-banner.png')} 
              style={styles.logo}
              onError={() => setLogoError(true)}
            />
          ) : (
            <Text style={styles.logoErrorText}>Gerenciador de Tarefas</Text>
          )}
          <Text style={[styles.header, { color: globalStyles.primaryColor }]}>Tarefas</Text>
        </View>

        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>Total de Tarefas: {tasks.length}</Text>
        </View>

        {/* Botões de filtro */}
        <View style={styles.filterButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('all')}
          >
            <Text style={[
              styles.filterButtonText,
              filter === 'all' && styles.filterButtonTextActive
            ]}>
              Todas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'completed' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[
              styles.filterButtonText,
              filter === 'completed' && styles.filterButtonTextActive
            ]}>
              Concluídas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'pending' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[
              styles.filterButtonText,
              filter === 'pending' && styles.filterButtonTextActive
            ]}>
              Pendentes
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtonsContainer}>
          <Pressable 
            style={({ pressed }) => [
              styles.actionButton,
              styles.actionButtonAdd,
              pressed && styles.actionButtonAddPressed
            ]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>Nova Tarefa</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.actionButton,
              styles.deleteButton,
              pressed && styles.deleteButtonPressed
            ]}
            onPress={() => setTasks([])} 
          >
            <Text style={styles.actionButtonText}>Excluir todas</Text>
          </Pressable>
        </View>

        <TaskList 
          tasks={filteredTasks} 
          onUpdate={updateMode} 
          onDelete={(id) => deleteTask(id, setTasks)} 
        />

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={resetForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isUpdating ? "Editar Tarefa" : "Nova Tarefa"}</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Nome da tarefa..."
              value={text}
              maxLength={50}
              onChangeText={setText}
            />

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Data limite:</Text>
              {Platform.OS === 'web' ? (
                // @ts-ignore
                <input 
                  type="date"
                  value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                  onChange={(e: any) => {
                    const val = e.target.value;
                    if (val) {
                      const parts = val.split('-');
                      setDueDate(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
                    } else {
                      setDueDate(null);
                    }
                  }}
                  style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', flex: 1, marginLeft: 16 }}
                />
              ) : (
                <View style={{ flex: 1, marginLeft: 16, alignItems: 'flex-start' }}>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerBtn}>
                    <Text>{dueDate ? dueDate.toLocaleDateString() : "Selecionar Data"}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={dueDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={onChangeDate}
                    />
                  )}
                </View>
              )}
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Concluída:</Text>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={completed}
                  onValueChange={setCompleted}
                  color={completed ? '#000' : undefined}
                />
              </View>
            </View>

            {/* Campo de prioridade */}
            <View style={styles.priorityContainer}>
              <Text style={styles.fieldLabel}>Prioridade:</Text>
              <View style={styles.priorityButtonsContainer}>
                {(['Baixa', 'Média', 'Alta'] as const).map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityButton,
                      priority === p && styles.priorityButtonActive
                    ]}
                    onPress={() => setPriority(p)}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      priority === p && styles.priorityButtonTextActive
                    ]}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={resetForm}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalSaveBtn, !text.trim() && styles.modalSaveBtnDisabled]} 
                onPress={handleSave}
                disabled={!text.trim()}
              >
                <Text style={styles.modalSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    backgroundColor: globalStyles.backgroundColor,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: globalStyles.primaryColor,
  },
  logoErrorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: globalStyles.primaryColor,
    marginBottom: 8,
  },
  counterContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: globalStyles.bodyFontSize,
    color: globalStyles.secondaryColor,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: globalStyles.primaryColor,
    backgroundColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: globalStyles.primaryColor,
  },
  filterButtonText: {
    color: globalStyles.primaryColor,
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    flex: 1,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  actionButtonAdd: {
    backgroundColor: globalStyles.primaryColor,
    shadowColor: globalStyles.primaryColor,
  },
  actionButtonAddPressed: {
    backgroundColor: '#333',
    transform: [{ scale: 0.98 }],
    elevation: 1,
    shadowOpacity: 0.1,
  },
  deleteButton: {
    backgroundColor: globalStyles.accentColor,
    shadowColor: globalStyles.accentColor,
  },
  deleteButtonPressed: {
    backgroundColor: '#d9363e',
    transform: [{ scale: 0.98 }],
    elevation: 1,
    shadowOpacity: 0.1,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: globalStyles.backgroundColor,
    borderRadius: 8,
    padding: 24,
    elevation: 5,
    shadowColor: globalStyles.primaryColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: globalStyles.primaryColor,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: globalStyles.bodyFontSize,
    fontWeight: 'bold',
    color: globalStyles.primaryColor,
  },
  checkboxContainer: {
    marginLeft: 16,
  },
  datePickerBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  priorityContainer: {
    marginBottom: 16,
  },
  priorityButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: globalStyles.primaryColor,
    borderColor: globalStyles.primaryColor,
  },
  priorityButtonText: {
    color: globalStyles.primaryColor,
    fontSize: 14,
    fontWeight: 'bold',
  },
  priorityButtonTextActive: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalCancelText: {
    color: globalStyles.secondaryColor,
    fontSize: globalStyles.bodyFontSize,
    fontWeight: 'bold',
  },
  modalSaveBtn: {
    backgroundColor: globalStyles.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  modalSaveBtnDisabled: {
    backgroundColor: '#ccc',
  },
  modalSaveText: {
    color: '#fff',
    fontSize: globalStyles.bodyFontSize,
    fontWeight: 'bold',
  },
});

