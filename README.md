# Rick and Morty Explorer 🛸

A modern, feature-rich React application for exploring the Rick and Morty universe. Built with cutting-edge technologies and best practices for scalability, performance, and user experience.

![Rick and Morty Explorer](./public/preview-project.gif)

## 🌟 Features

### Core Features

- **Character Explorer**: Browse and search through all Rick and Morty characters
- **Advanced Search**: Real-time search with debouncing and filters
- **Character Details**: Comprehensive character information with episodes
- **Favorites System**: Add/remove characters to favorites with persistence
- **Responsive Design**: Optimized for all device sizes
- **Dark/Light Theme**: Toggle between themes with system preference detection

### Technical Features

- **Modern Architecture**: Domain-driven design with clean separation of concerns
- **Performance Optimized**: React Query for caching, Suspense for loading states
- **Error Handling**: Comprehensive error boundaries and fallback UI
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Testing**: Unit tests with Vitest and E2E tests with Playwright
- **Type Safety**: Full TypeScript implementation with strict mode

## 🏗️ Architecture

### Domain-Driven Design

```
src/
├── domains/
│   ├── characters/          # Character domain
│   │   ├── components/      # Character-specific components
│   │   ├── hooks/          # Character-related hooks
│   │   └── services/       # Character API services
│   ├── episodes/           # Episode domain
│   └── locations/          # Location domain (future)
├── shared/
│   ├── components/         # Reusable UI components
│   ├── hooks/             # Shared hooks
│   ├── services/          # API services
│   ├── types/             # TypeScript definitions
│   ├── utils/             # Utility functions
│   └── providers/         # Context providers
└── components/            # Legacy components (being migrated)
```

### Key Design Patterns

- **Domain Separation**: Clear boundaries between different business domains
- **Service Layer**: Abstracted API calls with error handling
- **Hook-Based State**: Custom hooks for data fetching and state management
- **Component Composition**: Reusable components with consistent interfaces
- **Error Boundaries**: Graceful error handling at component level

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/rick-and-morty-explorer.git
   cd rick-and-morty-explorer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run unit tests
npm run test:coverage # Run tests with coverage
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Run E2E tests with UI

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🧪 Testing Strategy

### Unit Testing (Vitest + React Testing Library)

- Component behavior testing
- Hook functionality testing
- Utility function testing
- Service layer testing

### E2E Testing (Playwright)

- User journey testing
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility testing

### Test Coverage Goals

- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >90%
- **Lines**: >90%

## 🎨 UI/UX Design

### Design System

- **Colors**: Consistent color palette with dark/light theme support
- **Typography**: Inter font family with responsive sizing
- **Spacing**: 8px grid system
- **Components**: Reusable component library
- **Animations**: Framer Motion for smooth interactions

### Accessibility Features

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management
- ARIA labels and descriptions

## 📊 Performance Optimizations

### Data Fetching

- **React Query**: Intelligent caching and background updates
- **Debounced Search**: Reduced API calls during typing
- **Pagination**: Efficient data loading
- **Prefetching**: Anticipatory data loading

### Rendering

- **Code Splitting**: Lazy loading of components
- **Memoization**: Optimized re-renders
- **Virtual Scrolling**: Efficient list rendering (future)
- **Image Optimization**: Lazy loading and responsive images

### Bundle Optimization

- **Tree Shaking**: Remove unused code
- **Compression**: Gzip/Brotli compression
- **Caching**: Aggressive caching strategies
- **CDN**: Static asset delivery optimization

## 🔧 Configuration

### Environment Variables

```env
VITE_API_BASE_URL=https://rickandmortyapi.com/api
VITE_APP_TITLE=Rick and Morty Explorer
```

### Tailwind Configuration

Custom theme configuration in `tailwind.config.js`:

- Custom color palette
- Animation utilities
- Responsive breakpoints
- Dark mode support

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm run test`)
6. Run linting (`npm run lint`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration with React hooks
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

### Pull Request Guidelines

- Include tests for new features
- Update documentation as needed
- Ensure CI/CD pipeline passes
- Add screenshots for UI changes
- Reference related issues

## 📈 Performance Metrics

### Core Web Vitals Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Bundle Size Targets

- **Initial Bundle**: < 200KB gzipped
- **Total Bundle**: < 500KB gzipped
- **Chunk Size**: < 100KB per chunk

## 🔮 Roadmap

### Phase 1 (Current)

- ✅ Character exploration and search
- ✅ Favorites system
- ✅ Responsive design
- ✅ Dark/light theme

### Phase 2 (Next)

- 🔄 Episode exploration
- 🔄 Location exploration
- 🔄 Advanced filtering
- 🔄 Character comparison

### Phase 3 (Future)

- 📋 User accounts and profiles
- 📋 Social features (sharing, comments)
- 📋 Offline support (PWA)
- 📋 Advanced analytics

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Rick and Morty API**: [rickandmortyapi.com](https://rickandmortyapi.com/)
- **React Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For beautiful animations
- **React Query**: For excellent data fetching

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/rick-and-morty-explorer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/rick-and-morty-explorer/discussions)
- **Email**: support@rickandmortyexplorer.com

---

Made with ❤️ by the Rick and Morty Explorer team
