# HapiScript ===>

### Stack :
* HapiJs
* TypeScript 
* TypeOrm 
* Mysql

### Description : 

This is a simple boilerplate for a rest api designed with hapi and typescript. This particular api example has 3 entities:  
1. User
2. Role
3. User Profile

It's a simple role based authentication system project which is commonly required in almost every software.  

N.B: The project is still ongoing. The following features are yet to be integrated :
 * Casbin RBAC/ABAC
 * Password Reset (Through email/ OTP)  
 * TypeDi/tsyringe for dependency injection

    > #### This boilerplate is written following the service-repository pattern
 

### Installation:

Just simply clone the repository:

    git clone https://github.com/RiyadAhsan4516/hapijs-typescript-boilerplate.git

The boilerplate is built using yarn. So use the following:  

     yarn install

Set up a .env file in the root directory of the project containing the following:
   * NODE_ENV=``set the node environment to development``
   * PORT= ``set your port here``
   * LOCALHOST=``set localhost to 127.0.0.1``
   * DB_USER=``your database username``
   * DB_PASSWORD=``your database password``
   * DB_LOCAL=``name of your database``

For development use the following command to run:
   
    yarn start

For production use the following:

    yarn run production

And voilà! you're good to go!  

#### HAPPY CODING ! 👊👊

