# HapiScript ===>

### Stack :
* HapiJs
* TypeScript 
* TypeOrm 
* Mysql

### Description : 

This is a simple boilerplate for a rest api designed with hapi and typescript. This particular api example has 4 entities:  
1. User
2. Role
3. User Profile
4. Notification

It's a simple role based authentication system project which is commonly required in almost every software. It also includes push notification using SSE 

N.B: The project is still ongoing. The following features are yet to be integrated :
 * Casbin RBAC/ABAC
 * Password Reset (Through email/ OTP)

 
> ### Note: This boilerplate is written following the service-repository pattern
 

### Installation:

Just simply clone the repository:

    git clone https://github.com/RiyadAhsan4516/hapijs-typescript-boilerplate.git

The packages are maintained using yarn. So use yarn to install all the packages:  

     yarn install

Set up a .env file in the root directory of the project containing the following:
   * NODE_ENV=``set the node environment to development``
   * PORT= ``set your port here``
   * LOCALHOST=``set localhost to 127.0.0.1``
   * DB_USER=``your database username``
   * DB_PASSWORD=``your database password``
   * DB_LOCAL=``name of your database``
   * SECRET=``a secret key for generating jwt``
   * STATIC=``a static token for public routes``
   * LOGTAIL_LINK=``link of your logtail team profile. (optional)``
   * LOGTAIL_TOKEN=``access token of your logtail connection source (optional)``

For development use the following command to run:
   
    yarn run dev

For production use the following:

    yarn run prod

And voilà! you're good to go!  

#### HAPPY CODING ! 👊👊

