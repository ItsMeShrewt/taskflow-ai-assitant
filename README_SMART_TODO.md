# 🚀 Smart TODO List App

An AI-powered task management application built with Laravel and React that helps you stay productive with intelligent task analysis, automated subtask generation, time estimation, and web-enhanced suggestions.

## ✨ Features

### Core Features
- ✅ Create, edit, delete, and organize tasks
- 📝 Add detailed descriptions and subtasks
- 🎯 Set priorities (Low, Medium, High, Urgent)
- 📅 Due date tracking
- ⏱️ Time estimation and tracking
- 📊 Progress visualization
- 🔍 Search and filter tasks
- 🎨 Beautiful, responsive UI with Tailwind CSS

### AI-Powered Features
- 🤖 **Task Analysis**: Get AI-powered recommendations and step-by-step actions
- 🧩 **Automatic Subtask Generation**: Break down complex tasks into manageable steps
- ⏰ **Smart Time Estimation**: Get realistic time estimates with reasoning
- 💡 **Time Management Tips**: Receive personalized productivity advice
- 🔎 **Web Resource Search**: Find relevant tutorials, guides, and resources

## 🛠️ Tech Stack

### Backend
- **Laravel 12**: PHP framework
- **SQLite/MySQL**: Database
- **Laravel Sanctum**: API authentication
- **OpenAI PHP SDK**: AI integration
- **Guzzle**: HTTP client for API requests

### Frontend
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Inertia.js**: SPA adapter for Laravel
- **Tailwind CSS 4**: Styling
- **Radix UI**: Accessible components
- **Axios**: API requests
- **React DatePicker**: Date selection
- **date-fns**: Date formatting

## 📋 Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- OpenAI API key (for AI features)
- Optional: SerpAPI or Tavily API key (for web search)

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd todo-list
```

### 2. Install PHP dependencies
```bash
composer install
```

### 3. Install Node.js dependencies
```bash
npm install
```

### 4. Set up environment variables
```bash
cp .env.example .env
php artisan key:generate
```

### 5. Configure your `.env` file

**Database** (SQLite is default, already configured):
```env
DB_CONNECTION=sqlite
DB_DATABASE=todo_db
```

**OpenAI Configuration** (Required for AI features):
```env
OPENAI_API_KEY=your-openai-api-key-here
```

Get your OpenAI API key at: https://platform.openai.com/api-keys

**Web Search Configuration** (Optional, choose one):
```env
# Option 1: SerpAPI
SERP_API_KEY=your-serpapi-key-here

# Option 2: Tavily
TAVILY_API_KEY=your-tavily-api-key-here
```

### 6. Run migrations
```bash
php artisan migrate
```

### 7. Build frontend assets
```bash
npm run build
```

## 🎮 Running the Application

### Development Mode

Run all services (recommended):
```bash
composer dev
```

This will start:
- Laravel server (port 8000)
- Queue worker
- Vite dev server

Or run services individually:

**Terminal 1 - Laravel:**
```bash
php artisan serve
```

**Terminal 2 - Vite:**
```bash
npm run dev
```

**Terminal 3 - Queue Worker:**
```bash
php artisan queue:work
```

### Production Mode
```bash
npm run build
php artisan serve
```

## 📱 Usage

1. **Register/Login**: Create an account at `http://localhost:8000/register`

2. **Create a Task**:
   - Click "New Task" button
   - Enter title, description, priority, and due date
   - Click "Create Task"

3. **Use AI Features**:
   - Open any task
   - Click AI action buttons:
     - **Analyze Task**: Get comprehensive analysis and recommendations
     - **Generate Subtasks**: Automatically break down into steps
     - **Estimate Time**: Get AI-powered time estimates
     - **Find Resources**: Search for relevant tutorials and guides

4. **Manage Subtasks**:
   - Add subtasks manually or let AI generate them
   - Check off completed subtasks
   - Track progress automatically

5. **Organize Tasks**:
   - Filter by status, priority
   - Search by title/description
   - Sort by various criteria

## 🏗️ Project Structure

```
todo-list/
├── app/
│   ├── Http/Controllers/Api/    # API Controllers
│   ├── Models/                  # Eloquent Models
│   ├── Policies/                # Authorization Policies
│   └── Services/                # Business Logic Services
├── database/
│   └── migrations/              # Database Migrations
├── resources/
│   └── js/
│       ├── components/          # React Components
│       │   └── tasks/          # Task-related Components
│       ├── pages/              # Inertia Pages
│       ├── services/           # API Services
│       └── types/              # TypeScript Types
└── routes/
    ├── api.php                 # API Routes
    └── web.php                 # Web Routes
```

## 🔑 Key Components

### Backend Services

**AIService** (`app/Services/AIService.php`):
- Task analysis with OpenAI
- Subtask generation
- Time estimation
- Time management tips

**WebSearchService** (`app/Services/WebSearchService.php`):
- SerpAPI integration
- Tavily API integration
- Resource discovery

### Frontend Components

**Task Management**:
- `TaskList.tsx`: Task grid display
- `TaskCard.tsx`: Individual task card
- `TaskForm.tsx`: Create/edit form
- `TaskDetail.tsx`: Detailed task view
- `TaskFilters.tsx`: Search and filtering

**AI Features**:
- `SubtaskList.tsx`: Subtask management
- `AISuggestions.tsx`: AI recommendations display

## 🧪 Testing

Run PHP tests:
```bash
php artisan test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Endpoints

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/{id}` - Get task details
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### AI Features
- `POST /api/tasks/{id}/analyze` - Analyze task
- `POST /api/tasks/{id}/generate-subtasks` - Generate subtasks
- `POST /api/tasks/{id}/estimate-time` - Estimate time
- `POST /api/tasks/{id}/time-tips` - Get time management tips
- `POST /api/tasks/{id}/search-resources` - Search web resources

### Subtasks
- `GET /api/tasks/{id}/subtasks` - List subtasks
- `POST /api/tasks/{id}/subtasks` - Create subtask
- `PUT /api/tasks/{id}/subtasks/{subtaskId}` - Update subtask
- `DELETE /api/tasks/{id}/subtasks/{subtaskId}` - Delete subtask
- `POST /api/tasks/{id}/subtasks/reorder` - Reorder subtasks

## 🎨 Customization

### Change AI Model

Edit `app/Services/AIService.php`:
```php
'model' => 'gpt-4', // Change to 'gpt-3.5-turbo' or other models
```

### Modify Task Priorities

Edit `database/migrations/xxx_create_tasks_table.php`:
```php
$table->enum('priority', ['low', 'medium', 'high', 'urgent', 'critical'])
```

## 🐛 Troubleshooting

**AI features not working?**
- Check your OpenAI API key in `.env`
- Verify you have API credits
- Check Laravel logs: `storage/logs/laravel.log`

**Database errors?**
- Run migrations: `php artisan migrate:fresh`
- Check database connection in `.env`

**Frontend not loading?**
- Clear cache: `php artisan config:clear`
- Rebuild assets: `npm run build`
- Check browser console for errors

## 📄 License

This project is open-sourced software licensed under the MIT license.

## 🙏 Acknowledgments

- OpenAI for GPT API
- Laravel team
- React team
- All contributors

---

Built with ❤️ using Laravel, React, and AI
