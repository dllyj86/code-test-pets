# Weather UI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version `8.1.1`, `NodeJS 12.13.1`, `NPM 6.12.1`.  
This project used `Angular Material 8` to draw UI stuff.

## GitHub URL

[code-test-pets](https://github.com/dllyj86/code-test-pets)  
URL: <https://github.com/dllyj86/code-test-pets>

## Jenkins URL

[Jenkins](http://52.76.30.89:8080/job/pets-list-cicd/)  
URL: <http://52.76.30.89:8080/job/pets-list-cicd/>

If you want to visit my Jenkins, please use user name `visitor` and password `12345678`.

**Notice:**  
If you want to run the build, please inform me in advance. I need to change my EC2 from t2.micro to a larger type or the Jenkins will crash.

## Deployment

I use AWS CodeDeploy to make the deployment. The application is running in AWS EC2. Successful Jenkins build will trigger the deployment automatically.

Screenshots:  

![deployment group config](https://jimmy-demo-static-files.s3-ap-southeast-1.amazonaws.com/pets+1.PNG)

![deployment records](https://jimmy-demo-static-files.s3-ap-southeast-1.amazonaws.com/pet+2.PNG)

## Application URL

[Code Test - Pets](http://52.76.30.89:3301/)
URL: <http://52.76.30.89:3301/>

**Notice:**  
This application was deployed in AWS Singapore region. When you access the application first time with a slow network, it will take a long time to load the page. Please wait until the loading completed.

**Production API endpoint:**  
<http://5c92dbfae7b1a00014078e61.mockapi.io/owners>  

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

You could use Angular CLI to generate components, services and so on. Please refer to Angular CLI.

## Build

Built files are in `dist` folder.

**Notice:**  
Run `npm run prod-build` to build the application for production. It **disabled** `aot` and `build-optimizer`. The reason is that my AWS EC2 resource is limited. My EC2 is t2.micro. It could not support the Jenkins to build Angular projects. When I run the build, the Jenkins will crash. Even though I changed the EC2 to t2.small (2GB memory), the build with aot and build-optimizer enabled will take long time and make the build failed.

Currently, when I need to run the build, I use t2.small EC2. After the build success, I need to change the EC2 to t2.micro to run the applications because t2.micro EC2 is free.

I didn't setup trigger for building code automatically when I pushed the code to GitHub. If you want to deploy your code to produciton env, you have to trigger the build manually.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).  
Run `npm run ci-test` to execute the unit tests via Karma with Chrome headless. This is for the testing in Jenkins.

## Code structure

### Modules

1. app.module  
This is main module of this application.

2. custom-material.module  
This is custom config module to import Angular Material modules for UI component.

### Components

1. app.component  
Main component of this application.

2. pets-list.component  
This component shows pets list.  

3. error-message.component  
This is common component that shows error message in UI when service call is failed.

### Services

1. pets-list.service  
This service sends request to query pets list and convert the data to valid data that can be consumed in UI.

### Models

1. Pet
This model keeps pet data.

2. Owner
This model keeps owner data.

3. gender
This is Gender enum.

4. groupedpetsinterface
This is interface. It restricts the data format grouped pets data.

### mocks

1. api-response-mock.json  
This is mock file for mocking API response.

2. pets-array-mock.json  
This is mock file for converted pets data list. It is un-grouped by owner gender.

3. grouped-pets-mock.json
This is mock file for grouped pets list. The pets lists are grouped by Male and Female.

### environments

1. environment  
This file keeps application properties for dev environment.

2. environment.prod  
This file keeps application properties for production environment.
