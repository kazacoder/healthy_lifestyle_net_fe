FROM node:22-alpine AS build
WORKDIR /frontend
RUN npm install -g @angular/cli@19.2.8
COPY package.json .
RUN npm install
COPY ./public ./public
COPY ./src ./src
COPY .editorconfig .editorconfig
COPY .gitignore .gitignore
COPY angular.json angular.json
COPY nginx.conf nginx.conf
COPY tsconfig.app.json tsconfig.app.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.spec.json tsconfig.spec.json
#RUN npm run build

#FROM nginx
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#COPY --from=build /frontend/dist/healthy_lifestyle_net_fe/browser /usr/share/nginx/html
#EXPOSE 7077
