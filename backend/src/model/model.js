import { gql } from 'graphql-tag'
import mongoose from 'mongoose';
import { authMiddlewareGraph } from '../middlewares/index.js';

// ---------------------------------------------------------
// 1. MONGOOSE SCHEMA (Database Structure)
// ---------------------------------------------------------
const TaskSchema = new mongoose.Schema(
  {
    id: { type: String }, // Custom ID: task_123...
    title: { type: String, required: true },
    description: { type: String },
    status: { 
      type: String, 
      enum: ['TODO', 'IN_PROGRESS', 'DONE'], 
      default: 'TODO' 
    },
    priority: { 
      type: String, 
      enum: ['LOW', 'MEDIUM', 'HIGH'], 
      default: 'MEDIUM' 
    },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'project' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  },
  { timestamps: true }
);

// Indexes for performance
TaskSchema.index({ id: 1 }, { unique: true });
TaskSchema.index({ title: 'text', description: 'text' });

// Pre-save hook for Custom ID
TaskSchema.pre('save', function () {
  if (!this.id) {
    this.id = `task_${this._id}`;
  }
});

const TaskModel = mongoose.model('task', TaskSchema);
export default TaskModel;

// ---------------------------------------------------------
// 2. GRAPHQL TYPEDEFS (API Blueprint)
// ---------------------------------------------------------
export const TaskTypeDef = gql`
  type Task {
    _id: ID!
    id: ID
    title: String!
    description: String
    status: String
    priority: String
    projectId: ID
    assignedTo: ID
    createdAt: Date
    updatedAt: Date
  }

  input TaskInput {
    title: String!
    description: String
    status: String
    priority: String
    projectId: ID
    assignedTo: ID
  }

  extend type Query {
    taskList(projectId: ID): [Task]!
    taskDetail(id: ID!): Task
  }

  extend type Mutation {
    taskCreate(input: TaskInput!): Task
    taskUpdate(id: ID!, input: TaskInput!): Task
    taskDelete(id: ID!): MutationResponse
  }
`;

// ---------------------------------------------------------
// 3. GRAPHQL RESOLVERS (Logic)
// ---------------------------------------------------------
export const TaskResolver = {
  Query: {
    // taskList: async (_, { projectId }, { req }) => {
    //   authMiddlewareGraph(req); 
    //   return await TaskModel.find({ projectId }).sort({ createdAt: -1 });
    // }
    taskList: async (_, __, { req }) => {
  authMiddlewareGraph(req);
  return await TaskModel.find().sort({ createdAt: -1 });
},
    taskDetail: async (_, { id }, { req }) => {
      authMiddlewareGraph(req);
      return await TaskModel.findOne({ id });
    },
  },
  Mutation: {
    taskCreate: async (_, { input }, { req }) => {
       authMiddlewareGraph(req);
      const task = new TaskModel(input);
      await task.save();
      return task;
    },
    taskUpdate: async (_, { id, input }, { req }) => {
      authMiddlewareGraph(req);
      return await TaskModel.findOneAndUpdate({ id }, input, { new: true });
    },
    taskDelete: async (_, { id }, { req }) => {
      authMiddlewareGraph(req);
      const deleted = await TaskModel.findOneAndDelete({ id });
      return {
        success: !!deleted,
        message: deleted ? "Task deleted!" : "Task not found",
        code: deleted ? "200" : "404"
      };
    },
  },
};