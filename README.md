<!-- Google drive client in React -->
# Google Drive Client #

### Dependencies
1. mySQL - For storing the user details

	**Configuration -**

    ```
    host:'localhost',
    user:'root',
    password:'root',
    database:'dbname'
    ```
    **Table structure -**
    
    ```
    CREATE TABLE users( 
        user_id int AUTO_INCREMENT PRIMARY KEY, 
        email varchar(300), 
        name varchar(200), 
        provider varchar(50), 
        provider_id varchar(200), 
        provider_pic varchar(200), 
        token varchar(500)
    );
    ```

2. Redis - version>=5 ;  

    Redis is used to store access google drive access token after successful initialization of drive access per user.
    Redis is storing information in key value pair.
    Here in my project key is email-id and value is drive access token.
    When google returns drive access token in  NODEJS it also has expiry_time(ttl in redis)
    Key will expire automatically once ttl times out.

	**Configuration -**
    ```
    REDIS_PASSWORD = ''
    REDIS_HOST = '127.0.0.1' 
    REDIS_PORT = 6379
    ```
    NOTE - Configuration should be provided in index.js in server directory.

## Steps to follow to run this application-

1. Clone this repository

2. Go to server path (gd-client-final\server) and install packages
    ```
    gd-client-final\server> npm install
    ```
3. Go to project directory (gd-client-final) and run
    ```
    gd-client-final> npm install
    ```
4. Once the installation is complete, go to server directory and start the server.
    ```
    gd-client-final\server> npm start
    ```
5. Now start the react app.
    ```
    gd-client-final> npm start
    ```
6. Step 5 will open the react application in your browser at *http://localhost:3000/* - Login from there.

7. Once the login is done, It will redirect to home page of user and open one additional tabs.

    Login for drive access followed by some permission grant you will see some code sent by google saying - 
    
    *Please copy this code, switch to your application and paste it there:*

    Copy the code and paste it to the input space provided in the home screen and press **ENTER**.

8. On home screen you can see list of files fetched from your google drive with their name and its id along with the delete button.

9. For deleting a file hit the corresponding delete button and the file will be deleted from your drive. Based on the operation alert will get generated.



