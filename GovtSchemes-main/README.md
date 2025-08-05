# 🌾 Farmer Schemes Portal - Government of India

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://himanshuv20.github.io/GovtSchemes/)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://github.com/Himanshuv20/GovtSchemes)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, responsive web application that provides an interface to access Indian government schemes for farmers. This application showcases six major agricultural schemes with detailed information, eligibility criteria, and direct links to official portals.

![Farmer Schemes Portal](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Farmer+Schemes+Portal)

## 🌟 Features

### 🎯 Core Functionality
- **🎨 Modern UI/UX**: Clean, intuitive interface with smooth animations
- **📱 Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **🔍 Real-time Search**: Find relevant schemes instantly with powerful search functionality
- **📋 Detailed Information**: Comprehensive details about each scheme including benefits, eligibility, and application process
- **🔗 Direct Links**: Quick access to official government portals
- **📞 Emergency Support**: Direct access to Kisan Call Center (1551)
- **🎭 Interactive Modals**: Rich modal dialogs with scheme details and application guidance

### 🏛️ Government Schemes Included
1. **📞 Kisan Call Center (KCC)** - 24x7 agricultural helpline service
2. **🏪 National Agriculture Market (eNAM)** - Pan-India electronic trading portal
3. **📈 Rashtriya Krishi Vikas Yojana (RKVY)** - Agricultural development scheme
4. **🏗️ Agriculture Infrastructure Fund (AIF)** - Infrastructure financing facility
5. **🛡️ Pradhan Mantri Fasal Bima Yojana (PMFBY)** - Crop insurance scheme
6. **💰 PM Kisan Samman Nidhi** - Direct income support for farmers

## 🚀 Quick Start

### 📋 Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required - this is a static web application

### 🔧 Installation & Running

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Himanshuv20/GovtSchemes.git
   cd GovtSchemes
   ```

2. **Open the Application**
   - **Option 1**: Double-click on `index.html` to open in your default browser
   - **Option 2**: Right-click on `index.html` and select "Open with" your preferred browser
   - **Option 3**: Use a local server (recommended for development)

### 🌐 Using a Local Server (Recommended)

#### Using Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Using Node.js
```bash
# Install a simple server globally
npm install -g http-server

# Run the server
http-server
```

#### Using VS Code Live Server Extension
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

Then open your browser and navigate to `http://localhost:8000`

## 📁 Project Structure

```
GovtSchemes/
├── 📄 index.html          # Main HTML file
├── 🎨 styles.css          # CSS styles and responsive design
├── ⚡ script.js           # JavaScript functionality
├── 📚 README.md           # This file
└── 🚫 .gitignore          # Git ignore file
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Grid, Flexbox, and animations
  - CSS Custom Properties (Variables)
  - Advanced Grid and Flexbox layouts
  - CSS animations and transitions
  - Responsive design patterns
- **JavaScript (ES6+)**: Interactive functionality and dynamic content
  - Modern ES6+ features
  - Modular code structure
  - Event-driven architecture
- **Font Awesome**: Icons for better visual appeal
- **Google Fonts**: Inter font family for modern typography

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6, #2563eb, #1d4ed8)
- **Success**: Green (#22c55e, #16a34a, #15803d)
- **Warning**: Orange (#f59e0b, #d97706)
- **Error**: Red (#ef4444, #dc2626)
- **Gray Scale**: From #f8fafc to #0f172a

### Typography
- **Font Family**: Inter (Google Fonts)
- **Scale**: 0.75rem to 3rem with consistent ratios
- **Weights**: 300, 400, 500, 600, 700, 800

### Spacing System
- **Base Unit**: 0.25rem (4px)
- **Scale**: 1x to 20x base unit
- **Consistent**: Applied across all components

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **🖥️ Desktop** (1200px+): Full-featured experience with grid layouts
- **📱 Tablet** (768px - 1199px): Adapted layout with touch-friendly interactions
- **📲 Mobile** (320px - 767px): Optimized mobile experience with hamburger menu

### Breakpoints
- `768px`: Tablet and below
- `480px`: Mobile devices

## 🔧 Customization

### Adding New Schemes
To add a new government scheme, edit the `governmentSchemes` array in `script.js`:

```javascript
{
    id: 7, // Unique ID
    title: "New Scheme Name",
    category: "Scheme Category",
    description: "Detailed description of the scheme",
    benefits: [
        "Benefit 1",
        "Benefit 2",
        "Benefit 3"
    ],
    eligibility: "Who can apply",
    website: "https://official-website.gov.in",
    icon: "fas fa-icon-name", // Font Awesome icon
    iconColor: "#color-hex", // Icon background color
    priority: "high" // high, medium, low
}
```

### Modifying Styles
- Edit `styles.css` to change colors, fonts, or layout
- The CSS uses CSS custom properties (variables) for easy theme customization
- Responsive breakpoints: 768px (tablet) and 480px (mobile)

### Adding Functionality
- Edit `script.js` to add new features
- The code is well-commented and modular for easy understanding

## 🌐 Deployment

### GitHub Pages (Recommended)
1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select source as "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Your site will be available at `https://yourusername.github.io/repositoryname`

### Other Hosting Options
- **Netlify**: Drag and drop the folder to Netlify
- **Vercel**: Connect your GitHub repo to Vercel
- **Firebase Hosting**: Use Firebase CLI to deploy
- **Any Web Server**: Upload files to your web hosting provider

## 📞 Support & Contact Information

### Emergency Agricultural Support
- **☎️ Kisan Call Center**: 1551 (24x7, toll-free)
- **🚨 General Emergency**: 112
- **🐄 Livestock Emergency**: 1962

### Official Government Portals
- [🏛️ India.gov.in](https://www.india.gov.in)
- [🌾 Ministry of Agriculture](https://agricoop.nic.in)
- [💰 PM-KISAN Portal](https://pmkisan.gov.in)
- [🛡️ PMFBY Portal](https://www.pmfby.gov.in)

## 🌐 Browser Compatibility

The application is compatible with:
- **Chrome** 60+
- **Firefox** 55+
- **Safari** 12+
- **Edge** 79+
- **Mobile browsers** on iOS and Android

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔮 Future Enhancements

Potential improvements for the application:
- **🔗 Backend Integration**: Connect to real government APIs
- **👤 User Authentication**: Allow farmers to create profiles
- **📊 Application Tracking**: Track scheme application status
- **🌍 Multilingual Support**: Support for regional Indian languages
- **📱 PWA Features**: Progressive Web App capabilities
- **📍 Geolocation**: State-specific scheme filtering
- **🔔 Push Notifications**: Updates about new schemes or deadlines
- **📈 Analytics**: Usage analytics and insights
- **💬 Chat Support**: AI-powered chat assistance

## 📊 Performance

- **⚡ Fast Loading**: Optimized assets and minimal dependencies
- **📱 Mobile Optimized**: Touch-friendly interactions
- **♿ Accessible**: WCAG 2.1 compliant
- **🔍 SEO Friendly**: Semantic HTML and meta tags

## 🙏 Acknowledgments

- **🏛️ Government of India** for scheme information
- **🎨 Font Awesome** for icons
- **📝 Google Fonts** for typography
- **🌐 Open Source Community** for inspiration and best practices

---

**📝 Note**: This application provides information about government schemes for educational purposes. Always verify the latest information on official government websites before making any applications or decisions.

For any technical issues or suggestions, please open an issue on GitHub or contact the development team.

**Made with ❤️ for Indian Farmers**

## 🌾 Features

### Core Functionality
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Search & Filter**: Real-time search functionality to find relevant schemes
- **Detailed Information**: Comprehensive details about each scheme including benefits, eligibility, and application process
- **Direct Links**: Quick access to official government portals
- **Emergency Support**: Direct access to Kisan Call Center (1551)

### Government Schemes Included
1. **Kisan Call Center (KCC)** - 24x7 agricultural helpline service
2. **National Agriculture Market (eNAM)** - Pan-India electronic trading portal
3. **Rashtriya Krishi Vikas Yojana (RKVY)** - Agricultural development scheme
4. **Agriculture Infrastructure Fund (AIF)** - Infrastructure financing facility
5. **Pradhan Mantri Fasal Bima Yojana (PMFBY)** - Crop insurance scheme
6. **PM Kisan Samman Nidhi** - Direct income support for farmers

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required - this is a static web application

### Installation & Running

1. **Clone or Download the Project**
   ```bash
   # If you have git installed
   git clone <repository-url>
   
   # Or download the ZIP file and extract it
   ```

2. **Navigate to the Project Directory**
   ```bash
   cd GovtLinks
   ```

3. **Open the Application**
   - **Option 1**: Double-click on `index.html` to open in your default browser
   - **Option 2**: Right-click on `index.html` and select "Open with" your preferred browser
   - **Option 3**: Use a local server (recommended for development)

### Using a Local Server (Recommended)

For the best experience, especially during development, use a local server:

#### Using Python (if installed)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Using Node.js (if installed)
```bash
# Install a simple server globally
npm install -g http-server

# Run the server
http-server
```

#### Using VS Code Live Server Extension
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

Then open your browser and navigate to `http://localhost:8000` (or the port shown in your terminal)

## 📁 Project Structure

```
GovtLinks/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Interactive functionality and dynamic content
- **Font Awesome**: Icons for better visual appeal
- **Google Fonts**: Inter font family for modern typography

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Adapted layout with touch-friendly interactions
- **Mobile**: Optimized mobile experience with hamburger menu

## 🎨 Design Features

### Visual Elements
- **Modern Color Scheme**: Blue (#2563eb) primary with green (#10b981) accents
- **Smooth Animations**: CSS transitions and keyframe animations
- **Card-based Layout**: Clean, organized information presentation
- **Typography**: Professional font hierarchy with Inter font family

### Interactive Elements
- **Hover Effects**: Smooth transitions on buttons and cards
- **Modal Dialogs**: Detailed scheme information in overlay windows
- **Search Functionality**: Real-time filtering of schemes
- **Mobile Menu**: Responsive navigation for smaller screens

## 🔧 Customization

### Adding New Schemes
To add a new government scheme, edit the `governmentSchemes` array in `script.js`:

```javascript
{
    id: 7, // Unique ID
    title: "New Scheme Name",
    category: "Scheme Category",
    description: "Detailed description of the scheme",
    benefits: [
        "Benefit 1",
        "Benefit 2",
        "Benefit 3"
    ],
    eligibility: "Who can apply",
    website: "https://official-website.gov.in",
    icon: "fas fa-icon-name", // Font Awesome icon
    iconColor: "#color-hex", // Icon background color
    priority: "high" // high, medium, low
}
```

### Modifying Styles
- Edit `styles.css` to change colors, fonts, or layout
- The CSS uses CSS custom properties (variables) for easy theme customization
- Responsive breakpoints: 768px (tablet) and 480px (mobile)

### Adding Functionality
- Edit `script.js` to add new features
- The code is well-commented and modular for easy understanding

## 📞 Support & Contact Information

### Emergency Agricultural Support
- **Kisan Call Center**: 1551 (24x7, toll-free)
- **General Emergency**: 112
- **Livestock Emergency**: 1962

### Official Government Portals
- [India.gov.in](https://www.india.gov.in)
- [Ministry of Agriculture](https://agricoop.nic.in)
- [PM-KISAN Portal](https://pmkisan.gov.in)
- [PMFBY Portal](https://www.pmfby.gov.in)

## 🌐 Browser Compatibility

The application is compatible with:
- **Chrome** 60+
- **Firefox** 55+
- **Safari** 12+
- **Edge** 79+
- **Mobile browsers** on iOS and Android

## 📄 License

This project is created for educational and informational purposes. All government scheme information is sourced from official government websites and portals.

## 🤝 Contributing

To improve this application:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📋 Development Notes

### Code Organization
- **HTML**: Semantic structure with accessibility in mind
- **CSS**: Mobile-first responsive design with modern techniques
- **JavaScript**: ES6+ features with modular, reusable functions

### Performance Considerations
- Optimized images and assets
- Efficient CSS with minimal redundancy
- JavaScript debouncing for search functionality
- Lazy loading considerations for future enhancements

### Accessibility Features
- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## 🔮 Future Enhancements

Potential improvements for the application:
- **Backend Integration**: Connect to real government APIs
- **User Authentication**: Allow farmers to create profiles
- **Application Tracking**: Track scheme application status
- **Multilingual Support**: Support for regional Indian languages
- **Offline Support**: Progressive Web App capabilities
- **Geolocation**: State-specific scheme filtering
- **Push Notifications**: Updates about new schemes or deadlines

## 📊 Testing

### Manual Testing Checklist
- [ ] Responsive design on different screen sizes
- [ ] Search functionality works correctly
- [ ] All modal dialogs open and close properly
- [ ] External links open in new tabs
- [ ] Phone number links work on mobile devices
- [ ] Navigation menu works on mobile
- [ ] All animations and transitions are smooth

### Browser Testing
Test the application in multiple browsers to ensure compatibility and consistent behavior.

---

**Note**: This application provides information about government schemes for educational purposes. Always verify the latest information on official government websites before making any applications or decisions.

For any technical issues or suggestions, please refer to the repository's issue tracker or contact the development team.
