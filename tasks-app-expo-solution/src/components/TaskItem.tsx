import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { TaskItem as TaskType } from '../utils/handle-api';
import { globalStyles } from '../styles/global';

interface TaskItemProps {
  task: TaskType;
  updateMode: () => void;
  deleteTask: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, updateMode, deleteTask }) => {
  // Função para verificar se a data está vencida
  const isOverdue = (dueDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  return (
    <View style={styles.task}>
      <View style={styles.contentContainer}>
        <Text style={[styles.text, !!task.completed && styles.textCompleted]}>
          {task.text}
        </Text>
        {task.dueDate && (
          <Text style={[
            styles.dateText,
            isOverdue(task.dueDate) ? styles.dateTextOverdue : styles.dateTextOnTime
          ]}>
            Até: {new Date(task.dueDate).toLocaleDateString()}
          </Text>
        )}
      </View>
      <View style={styles.icons}>
        <TouchableOpacity onPress={updateMode} accessibilityRole="button">
          <Feather name="edit" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteTask} accessibilityRole="button">
          <AntDesign name="delete" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  task: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    marginRight: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  dateText: {
    fontSize: 12,
    marginTop: 4,
  },
  dateTextOverdue: {
    color: globalStyles.overdueDateColor,
    fontWeight: 'bold',
  },
  dateTextOnTime: {
    color: globalStyles.onTimeColor,
    fontWeight: 'bold',
  },
  icons: {
    flexDirection: 'row',
    gap: 16,
  },
  icon: {
    padding: 2,
  },
});

export default TaskItem;
