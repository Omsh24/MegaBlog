import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

// og: this is appwrites built in servies that directly allow us to make accounts and 
// talk about clients, so we write this stuff nicely

// even if we change any backend software or its services then we only need to work here in this file

export class AuthService {
    //2. here we have created this variable to use
    client = new Client();
    //we dont make this object direvly bcz it depends on the client, with some added properties
    // so we use a constructor so that whenever a new object is used here we get some new props
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        //3. now once we have added these props to the client, we can now make account object
        this.account = new Account(this.client)
    }

    //4. this is a method to create and account to do data abstraction
    async createAccount({email, password, name}){
        //5. try and catch to handle errors
        try {
            //6. creation always requires us to have a unique id, so we use the ID 
            // we have gotton from appwrtie and use unique function
            const userAccount = await this.account.create(ID.unique(), email, password, name);

            if(userAccount){
                //if account exists (has been made) we direct the user to home page i.e., 
                //they have logged in

                //use redirect method here, this passes user directly to login
                return this.login({email, password});
            }
            else{
                //no account has been created, so throw an error
                return userAccount;
            }

        } catch (error) {
            throw error;
        }
    }

    async login({email, password}){
        try {
            return await this.account.createEmailPasswordSession(email, password); 
        } catch (error) {
            throw error;
        }
    }

    //fucntion to check if the user is logged in or not
    async getCurrentUser(){
        try {
           return await this.account.get();
        } catch (error) {
            // throw error;
            console.log("Appwrite Services :: getCurrentUser :: error", error);
        }
        return null;
    }

    async logout(){
        try {
            await this.account.deleteSessions();
        } catch (error) {
            throw error;
        }
    }
}

//1. we have created an object of the class here to use indefinetly whenever we want to
const authService = new AuthService()

export default authService