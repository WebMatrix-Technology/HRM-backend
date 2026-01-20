"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const Task_model_1 = __importDefault(require("../models/Task.model"));
const Project_model_1 = __importDefault(require("../models/Project.model"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const testTaskUpdate = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose_1.default.connect(process.env.DATABASE_URL);
        console.log('Connected.');
        // 1. Find or Create a Project
        let project = await Project_model_1.default.findOne();
        if (!project) {
            console.log('Creating dummy project...');
            project = await Project_model_1.default.create({
                name: 'Test Project',
                status: 'PLANNING',
                priority: 'MEDIUM',
                startDate: new Date(),
                managerId: new mongoose_1.default.Types.ObjectId(), // Fake ID
            });
        }
        console.log(`Using Project: ${project._id}`);
        // 2. Create a Task
        console.log('Creating test task...');
        const task = await Task_model_1.default.create({
            title: 'Test Task for 500 Error',
            status: 'Backlog',
            priority: 'Medium',
            projectId: project._id,
        });
        console.log(`Task created: ${task._id}`);
        // 3. Test Normal Update
        console.log('Testing Normal Update...');
        await updateTask(task._id, { status: 'In Progress' });
        // 4. Test Update with Invalid Enum (Should fail validation)
        console.log('Testing Invalid Enum Update...');
        try {
            await updateTask(task._id, { status: 'INVALID_STATUS' });
        }
        catch (e) {
            console.log('Expected error:', e.message);
        }
        // 5. Test Update preventing Populate crash (simulating broken reference)
        console.log('Testing Update with Mocked Broken Project Ref...');
        // Manually break the reference in DB
        await Task_model_1.default.updateOne({ _id: task._id }, { projectId: new mongoose_1.default.Types.ObjectId() });
        await updateTask(task._id, { status: 'Done' });
        // 6. Test CastError (Invalid Type for Number)
        console.log('Testing Invalid Type Update (StoryPoints)...');
        try {
            await updateTask(task._id, { storyPoints: "NotANumber" });
        }
        catch (e) {
            console.log('Expected error:', e.message);
        }
        // Cleanup
        console.log('Cleaning up...');
        await Task_model_1.default.findByIdAndDelete(task._id);
        console.log('Done.');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
};
// Simulate the controller's update logic
async function updateTask(id, updates) {
    try {
        if (updates.projectId && !mongoose_1.default.Types.ObjectId.isValid(updates.projectId)) {
            delete updates.projectId;
        }
        const task = await Task_model_1.default.findByIdAndUpdate(id, updates, { new: true })
            .populate('projectId', 'name')
            .populate('assigneeId', 'firstName lastName avatar'); // This might crash if assigneeId is invalid?
        if (!task)
            throw new Error('Task not found');
        console.log('✅ Update successful:', task.title, task.status);
        console.log('   Project:', task.projectId); // Should be null if broken ref
    }
    catch (err) {
        console.error('❌ Update crashed:', err.message);
        throw err;
    }
}
testTaskUpdate();
//# sourceMappingURL=test_task_update.js.map