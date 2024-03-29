## Internationalization Feature

## Problem

Our application, the Academic Team Management, is within the Umple organization managed by Professor Timothy Lethbridge at uOttawa. The application will help professors and students form capstone and honours projects. The application is being developed within SEG 4911 and SEG 4910 (Software Engineering Capstone Project). Professors use the application to advertise projects, and students to form groups as well as join projects.

The problem is that since it is used within the University of Ottawa, the application needs to be in both official languages, French and English. Currently, our application is only written in English. Therefore, for the application to be usable by all students at the university, we need to add internationalization.

![Alt text](image.png)

## Appetite

This feature will be a Big Batch, which will require six weeks. The scope of this feature will include setting up the internationalization, converting the hard-coded strings in the application to string variables and finally adding a UI component to transition from one language to the other easily. The application has a professor and student view with different sections with text that each needs to be internationalized. Many pages have tables and modals, as shown in the figures below. All the elements would need to be translated.

![Alt text](image-1.png)

![Alt text](image-2.png)

We propose dedicating six weeks to this project, involving a team of 2 developers and one designer. The goal is to create a fully functional bilingual app (English and French) that is culturally sensitive and resonates with our target audience. Therefore, we can outline the work being done in six weeks from a high-level overview. The team extensively researched and designed the UI elements during the first week. The components needed to translate the app will be developed during the second week. During the third week, the professor's view would be translated. During the fourth week, the translation of the student view would be done. The app will be tested during the fifth week to integrate the language functionality and UI adjustments. Any bugs found during the testing will be fixed during the sixth week.

## Solution

The solution is implementing a solid internationalization (i18n) feature within our Academic Team Management web application. This approach entails translating all string elements in our application, from buttons and menus to error messages and notifications, to be offered in English and French. As there are cultural and direct translation differences, we will incorporate region-specific nuances, aligning our app with our French-speaking users' linguistic and cultural expectations.

### Fat Markers

The fat marker sketches below show the functionality to translate the web app as a button, which allows the user to toggle from French to English. This is a convenient and straightforward way to implement an option to switch languages.

![Alt text](image-5.png)

![Alt text](image-6.png)

### Breadboards

The figure below shows a breadboard outlining the components and connections involved in our feature. The user will navigate to the welcome page, act on a language field, and then navigate to the language selection menu to select English or French as the application language. 

![Alt text](image-7.png)

## Rabbit holes

There are many differences between English and French. Therefore, when translating the strings used in our application, many discussions and debates can occur to choose the right words. We must be careful to spend only a little time nitpicking word choice. Integrating a language switcher requires UI research and design to guarantee effortless user interaction. There are different ways to implement it (e.g., using a toggle or a drop-down list). Constant communication between developers, designers, and localization experts is necessary to ensure the unified integration of bilingual functionality.

## No-gos

Some more complex features, such as speech-specific translations and voice recognition for language selection, are outside the project scope. We also will not expand the scope of the languages used in the application. We are limiting it to French and English. These additional elements would be valuable and very interesting, but implementing them would require a lot of research and resources. Therefore, they are unfeasible within our current time constraints.