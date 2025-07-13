import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Clock, AlertTriangle, Plus } from 'lucide-react';
import { brandConfig } from '../../../config/brandConfig';
import { dashboardConfig } from '../../../config/employeeDashboardData';
import type { ITask } from '../../../interfaces/EmployeeTypes';

interface IEmployeeTasksContentProps {
  tasks: ITask[];
  userRole: string;
}

export const EmployeeTasksContent: React.FC<IEmployeeTasksContentProps> = ({
  tasks,
  userRole
}) => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return brandConfig.colors.errorRed;
      case 'medium': return brandConfig.colors.alertAmber;
      case 'low': return brandConfig.colors.successGreen;
      default: return brandConfig.colors.neutralGray;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckSquare className="w-4 h-4" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div 
        className="rounded-3xl p-6 shadow-lg border"
        style={{
          backgroundColor: brandConfig.colors.barnWhite,
          borderColor: `${brandConfig.colors.sterlingSilver}33`,
          borderRadius: brandConfig.layout.borderRadius
        }}
      >
        <div className="flex items-center justify-between">
          <h2 
            className="text-2xl font-bold"
            style={{
              color: brandConfig.colors.stableMahogany,
              fontSize: brandConfig.typography.fontSize2xl,
              fontWeight: brandConfig.typography.weightBold
            }}
          >
            {dashboardConfig.headers.priorityTasks}
          </h2>
          <button 
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
            style={{
              backgroundColor: brandConfig.colors.hunterGreen,
              color: brandConfig.colors.arenaSand,
              fontSize: brandConfig.typography.fontSizeSm,
              fontWeight: brandConfig.typography.weightMedium,
              borderRadius: brandConfig.layout.borderRadius
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
        <p 
          className="mt-2"
          style={{
            color: `${brandConfig.colors.midnightBlack}99`,
            fontSize: brandConfig.typography.fontSizeSm
          }}
        >
          Manage your daily responsibilities and track progress
        </p>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {sortedTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all ${
              completedTasks.has(task.id) ? 'opacity-75' : ''
            }`}
            style={{
              backgroundColor: brandConfig.colors.barnWhite,
              borderColor: `${brandConfig.colors.sterlingSilver}33`,
              borderRadius: brandConfig.layout.borderRadius
            }}
          >
            <div className="flex items-start space-x-4">
              
              {/* Task Checkbox */}
              <button
                onClick={() => toggleTask(task.id)}
                className="mt-1 hover:scale-105 transition-transform"
              >
                {completedTasks.has(task.id) ? (
                  <CheckSquare 
                    className="w-5 h-5" 
                    style={{ color: brandConfig.colors.successGreen }} 
                  />
                ) : (
                  <Square 
                    className="w-5 h-5" 
                    style={{ color: brandConfig.colors.neutralGray }} 
                  />
                )}
              </button>

              {/* Task Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 
                    className={`font-semibold ${
                      completedTasks.has(task.id) ? 'line-through' : ''
                    }`}
                    style={{
                      color: completedTasks.has(task.id) 
                        ? `${brandConfig.colors.midnightBlack}66`
                        : brandConfig.colors.midnightBlack,
                      fontSize: brandConfig.typography.fontSizeLg,
                      fontWeight: brandConfig.typography.weightSemiBold
                    }}
                  >
                    {task.title}
                  </h3>
                  
                  {/* Priority Badge */}
                  <div 
                    className="flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${getPriorityColor(task.priority)}1a`,
                      color: getPriorityColor(task.priority),
                      fontSize: brandConfig.typography.fontSizeXs,
                      fontWeight: brandConfig.typography.weightMedium,
                      borderRadius: brandConfig.layout.borderRadius
                    }}
                  >
                    {getPriorityIcon(task.priority)}
                    <span>{task.priority.toUpperCase()}</span>
                  </div>
                </div>

                <p 
                  className={`mb-3 ${
                    completedTasks.has(task.id) ? 'line-through' : ''
                  }`}
                  style={{
                    color: completedTasks.has(task.id)
                      ? `${brandConfig.colors.midnightBlack}66`
                      : `${brandConfig.colors.midnightBlack}cc`,
                    fontSize: brandConfig.typography.fontSizeSm
                  }}
                >
                  {task.description}
                </p>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" style={{ color: brandConfig.colors.neutralGray }} />
                    <span 
                      style={{
                        color: brandConfig.colors.neutralGray,
                        fontSize: brandConfig.typography.fontSizeSm
                      }}
                    >
                      {dashboardConfig.messages.due} {task.dueDate}
                      {task.dueTime && ` at ${task.dueTime}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <CheckSquare 
            className="w-16 h-16 mx-auto mb-4" 
            style={{ color: brandConfig.colors.neutralGray }} 
          />
          <h3 
            className="text-xl font-semibold mb-2"
            style={{
              color: brandConfig.colors.midnightBlack,
              fontSize: brandConfig.typography.fontSizeXl,
              fontWeight: brandConfig.typography.weightSemiBold
            }}
          >
            No Tasks Today
          </h3>
          <p 
            style={{
              color: `${brandConfig.colors.midnightBlack}99`,
              fontSize: brandConfig.typography.fontSizeBase
            }}
          >
            All caught up! New tasks will appear here.
          </p>
        </motion.div>
      )}
    </div>
  );
}; 