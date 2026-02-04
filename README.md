# Car History Site - Albanian Vehicle History Check Platform

This is an SEO-optimized React application for checking vehicle history, specifically targeting Albanian-speaking users in Albania, Kosovo, and the Albanian diaspora.

## SEO Features

This application implements comprehensive SEO best practices:

### Technical SEO
- **Static Prerendering**: Uses react-snap for static HTML generation (SSR alternative)
- **Core Web Vitals**: Optimized for fast loading and performance
- **Mobile-First**: Responsive design with Tailwind CSS
- **Structured Data**: JSON-LD Schema.org markup for WebApplication, LocalBusiness, Car, and FAQPage
- **Meta Tags**: Complete Open Graph and Twitter Card support
- **Multilingual**: Hreflang tags for Albanian (Albania & Kosovo)
- **Sitemap & Robots**: Properly configured for search engines

### On-Page SEO
- **Keywords**: Optimized for Albanian terms like "kontrollo automjetin", "histori automjeti", "kontroll VIN", etc.
- **Semantic HTML**: Proper heading hierarchy (H1-H3)
- **Accessibility**: ARIA labels on all icons and interactive elements
- **Content**: Rich, keyword-optimized Albanian content

### Performance
- **Code Splitting**: Automatic with React
- **Minification**: Production builds are optimized
- **Lazy Loading**: Prepared for image lazy loading

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
After building, react-snap will prerender the application for better SEO (generates static HTML).

**Note**: To skip react-snap prerendering (e.g., in CI environments without Chromium), set the environment variable:
```bash
SKIP_REACT_SNAP=true npm run build
```

Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
