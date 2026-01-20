
// @ts-nocheck
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Task from '../models/Task.model';
import Project from '../models/Project.model';
import Employee from '../models/Employee.model';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const testTaskUpdate = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected.');

        // 1. Find or Create a Project
        let project = await Project.findOne();
        if (!project) {
            console.log('Creating dummy project...');
            project = await Project.create({
                name: 'Test Project',
                status: 'PLANNING',
                priority: 'MEDIUM',
                startDate: new Date(),
                managerId: new mongoose.Types.ObjectId(), // Fake ID
            });
        }
        console.log(`Using Project: ${project._id}`);

        // 2. Create a Task
        console.log('Creating test task...');
        const task = await Task.create({
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
        } catch (e) { console.log('Expected error:', e.message); }

        // 5. Test Update preventing Populate crash (simulating broken reference)
        console.log('Testing Update with Mocked Broken Project Ref...');
        // Manually break the reference in DB
        await Task.updateOne({ _id: task._id }, { projectId: new mongoose.Types.ObjectId() });

        await updateTask(task._id, { status: 'Done' });

        // Cleanup
        console.log('Cleaning up...');
        await Task.findByIdAndDelete(task._id);
        console.log('Done.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
};

// Simulate the controller's update logic
async function updateTask(id, updates) {
    try {
        if (updates.projectId && !mongoose.Types.ObjectId.isValid(updates.projectId)) {
            delete updates.projectId;
        }

        const task = await Task.findByIdAndUpdate(id, updates, { new: true })
            .populate('projectId', 'name')
            .populate('assigneeId', 'firstName lastName avatar'); // This might crash if assigneeId is invalid?

        if (!task) throw new Error('Task not found');
        console.log('✅ Update successful:', task.title, task.status);
        console.log('   Project:', task.projectId); // Should be null if broken ref
    } catch (err) {
        console.error('❌ Update crashed:', err.message);
        throw err;
    }
}

testTaskUpdate();
