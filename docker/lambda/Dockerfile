# Use Amazon provided base image for Node.js 18 with Lambda
FROM public.ecr.aws/lambda/nodejs:18

WORKDIR /app

# Install dependencies
# Copy package files first for caching
COPY package.json tsconfig.json tsconfig.lambda.json ./
RUN npm install

# Copy your source code
COPY src ./src

# Build the TypeScript
RUN npm run build:lambda


# RUN mv ./dist/entrypoints/lambda/* ./dist/
# RUN rm -rf ./dist/entrypoints


# Set the CMD to your handler file
# By default the base image looks for index.handler in the /var/task/
# So copy compiled dist to /var/task
RUN cp -r dist/* ${LAMBDA_TASK_ROOT}
RUN ls -la ${LAMBDA_TASK_ROOT}
# (Optional) You can remove any dev dependencies if desired with `npm prune --production`

# Command is the specific file and export in your compiled code
CMD ["index.handler"]
