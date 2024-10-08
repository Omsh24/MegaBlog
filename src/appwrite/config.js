import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";

//same stuff as auth file but for databases

export class Services{
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            //this fxn requires database id, collection id, and a unique id which is the slug here
            // we are not using the ID.unique() function here
            //then there are things we are passing, the data
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            )
        } catch (error) {
            console.log("Appwrite Services :: createPost :: error", error);
            return false;
        }
    }

    //to update we need a unique id, that is the slug here, so its passed seperately
    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.log("Appwrite Services :: createPost :: error", error);
            return false;
        }
    }

    //only need the id for this
    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            //to signify success
            return true;
        } catch (error) {
            console.log("Appwrite Services :: createPost :: error", error);
            return false;
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite Services :: createPost :: error", error);
            return false;
        }       
    }

    //to get all the posts that are active, this is done using queries
    //this status is from: databases->blog->articles->indexes->status
    //this line says to get all posts where status is active
    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
                //we can also add pages and limit the no of results feched with extra options here
            )
        } catch (error) {
            console.log("Appwrite Services :: createPost :: error", error);
            return false;
        }  
    }


    //FILE UPLOAD SERVICES

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite Services :: createPost :: error", error);
            return false;
        }  
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        } catch (error) {
            console.log("Appwrite Services :: createPost :: error", error);
            return false;
        }
    }

    //to get the preview of the file
    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }

}

const services = new Services()
export default services

