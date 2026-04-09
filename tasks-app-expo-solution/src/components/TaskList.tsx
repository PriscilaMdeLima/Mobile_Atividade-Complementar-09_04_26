import React, { useMemo } from 'react';
import { SectionList, StyleSheet, View, Text } from 'react-native';
import TaskItem from './TaskItem';
import { TaskItem as TaskType } from '../utils/handle-api';

interface TaskListProps {
  tasks: TaskType[];
  onUpdate: (task: TaskType) => void;
  onDelete: (id: string) => void;
}

interface SectionData {
  title: string;
  data: TaskType[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdate, onDelete }) => {
  // Transformar o array de tarefas em seções
  const sections = useMemo(() => {
    const completed = tasks.filter(task => task.completed === true);
    const pending = tasks.filter(task => task.completed !== true);

    return [
      {
        title: '✅ Concluídas',
        data: completed,
      },
      {
        title: '☐ Pendentes',
        data: pending,
      },
    ] as SectionData[];
  }, [tasks]);

  const renderSectionHeader = ({ section }: { section: SectionData }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <Text style={styles.emptyMessage}>Nenhuma tarefa nesta categoria.</Text>
  );

  return (
    <View style={styles.listContainer}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            updateMode={() => onUpdate(item)}
            deleteTask={() => onDelete(item._id)}
          />
        )}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    borderRadius: 4,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 16,
    marginBottom: 16,
  },
});

export default TaskList;
