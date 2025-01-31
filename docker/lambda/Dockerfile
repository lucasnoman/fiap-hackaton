# Use Amazon provided base image for Node.js 18 with Lambda
FROM public.ecr.aws/lambda/nodejs:18

# Install dependencies
# Copy package files first for caching
COPY package.json tsconfig.json tsconfig.lambda.json ./
RUN npm install

# Copy your source code
COPY src ./src

# Build the TypeScript
RUN npm run build:lambda


RUN mv ./dist/entrypoints/lambda/* ./dist/
RUN rm -rf ./dist/entrypoints

RUN ls -laR
# Set the CMD to your handler file
# By default the base image looks for index.handler in the /var/task/
# So copy compiled dist to /var/task
COPY ./dist/ /var/task/
# (Optional) You can remove any dev dependencies if desired with `npm prune --production`

# Command is the specific file and export in your compiled code
CMD ["index.handler"]
