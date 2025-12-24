# 🎯 Quick Start Guide - Smart TODO List

## 🚀 Get Started in 5 Minutes!

### Step 1: Set Up Your API Key

1. Get an OpenAI API key from: https://platform.openai.com/api-keys
2. Open your `.env` file
3. Add your key:
   ```env
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

### Step 2: Register an Account

1. Start the app: `composer dev`
2. Visit: http://localhost:8000/register
3. Create your account

### Step 3: Create Your First Task

1. Click "**My Tasks**" in the sidebar
2. Click "**New Task**" button
3. Fill in:
   - **Title**: "Prepare presentation for Monday"
   - **Description**: "Need to create slides about Q4 results"
   - **Priority**: High
   - **Due Date**: Select Monday
4. Click "**Create Task**"

### Step 4: Use AI Magic! ✨

Open your task and try these AI features:

#### 1. **Analyze Task** 🤖
- Click "Analyze Task"
- Get comprehensive analysis and recommendations
- See actionable steps to complete your task

#### 2. **Generate Subtasks** 🧩
- Click "Generate Subtasks"
- AI breaks down your task into manageable steps
- Each subtask has estimated time
- Check them off as you complete!

#### 3. **Estimate Time** ⏰
- Click "Estimate Time"
- AI calculates realistic time needed
- See reasoning behind the estimate

#### 4. **Find Resources** 🔎
- Click "Find Resources"
- AI searches for tutorials, guides, articles
- Get direct links to helpful resources

## 💡 Example: Try This!

### Create this task:
```
Title: Learn React Hooks
Description: I want to understand useState, useEffect, and custom hooks
Priority: High
```

### Then use AI:
1. **Analyze Task** → Get learning strategy
2. **Generate Subtasks** → Break into learning modules
3. **Find Resources** → Get best tutorials
4. **Estimate Time** → Know how long it'll take

## 🎨 Tips & Tricks

### Priority Levels
- 🔵 **Low**: Nice to have
- 🟡 **Medium**: Should do soon
- 🟠 **High**: Important
- 🔴 **Urgent**: Do immediately!

### Task Statuses
- ⚪ **Pending**: Not started
- 🔵 **In Progress**: Currently working
- 🟢 **Completed**: Done!
- 🔴 **Cancelled**: Not doing

### Keyboard Shortcuts
- Click task card → View details
- Check subtask box → Mark complete
- Edit button → Update task

## 🔍 Search & Filter

Use the filter bar to:
- 🔎 Search by title/description
- 📊 Filter by status
- 🎯 Filter by priority  
- 📅 Sort by due date, created date, etc.

## 📈 Track Progress

Watch your progress bars:
- Task cards show subtask completion
- Task detail shows overall progress
- Green = more complete!

## 🎯 Best Practices

1. **Break Down Big Tasks**: Use "Generate Subtasks" for complex projects
2. **Set Realistic Priorities**: Not everything can be urgent
3. **Use Due Dates**: Stay on track with deadlines
4. **Check Off Subtasks**: Feel accomplished as you progress
5. **Use AI Suggestions**: Get unstuck with AI recommendations

## 🆘 Need Help?

### AI Not Working?
- Check `.env` has correct OpenAI API key
- Verify you have API credits
- Look at `storage/logs/laravel.log`

### Can't See Tasks?
- Make sure you're logged in
- Check you're on `/tasks` page
- Try refreshing the page

### Frontend Issues?
- Run: `npm run build`
- Clear cache: `php artisan config:clear`
- Restart dev server

## 🎉 You're Ready!

Start creating tasks and let AI help you stay productive!

---

**Pro Tip**: Create a task called "Learn Smart TODO List" and let AI teach you all the features! 😉
