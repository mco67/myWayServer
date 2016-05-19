import { injectable, inject } from "inversify";
import { HttpService } from './common/httpService';
import { Express, Request, Response, NextFunction } from "express";
import { User, UserSchema } from "../models/user";
import * as multer from "multer";

export interface UserService {

}

@injectable()
export class UserServiceImpl implements UserService {

    private avatarUploader : any;

    constructor( @inject("HttpService") private httpService: HttpService) {
        console.log("[USERSERVICE] -- Attach users routes");
 
        // Create the avatar uploader
        this.avatarUploader = this.createAvatarUploader();
    
        // Create superadmin user if necessary
        this.createSuperadmin()
            .then(() => {
                
                // Add userService routes  
                this.httpService.addOptionsRoute('/api/v1.0/user/user', this.userPreFlight);
                this.httpService.addGetRoute('/api/v1.0/user/user', 
                    this.httpService.passport.authenticate('bearer', { session: false }), 
                    (req: Request, res: Response, next: NextFunction) => { this.getOwnUser(req, res, next); 
                });

                this.httpService.addPostRoute('/api/v1.0/user/avatar', 
                    this.httpService.passport.authenticate('bearer', { session: false }), 
                    this.avatarUploader.single("file"), 
                    (req: Request, res: Response, next: NextFunction) => { res.send(req.files); } 
                );
   
                // Add userService admin routes  
                //this.httpService.addGetRoute('/api/v1.0/admin/users', this.getUsers);
                //this.httpService.addPostRoute('/api/v1.0/admin/users', this.createUser);
                //this.httpService.addDeleteRoute('/api/v1.0/admin/users/:id', this.deleteUser);
            })
    }

    private userPreFlight(req: Request, res: Response, next: NextFunction): any {
        console.log("[USER_SERVICE] /api/v1.0/user/user : doing preflight");
        res.status(204).end();
    }
    
    private getOwnUser(req: Request, res: Response, next: NextFunction): void {
        let user = req.user;
        user.password = '****';
        res.status(200).json({ "data": user });
    }

    private createAvatarUploader(): any {
        let storage = multer.diskStorage({
            destination: function (req, file, cb) { cb(null, `./avatars/`); },
            filename: function (req, file, cb) { cb(null, `${req['user']['_id']}`); }
        });
        return multer({ storage: storage });
    }








    public createUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        // Create the user object
        let user = new User({
            login: req.body.login,
            password: req.body.password,
            email: req.body.email,
            phone: req.body.phone,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            created: new Date()
        });
        // Save user in DB
        return this.saveUserInDB(user);
    }
    public getUsers(req: Request, res: Response, next: NextFunction): Promise<Array<any>> {
        return this.getUsersInDB();
    }

    public deleteUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        return this.removeUserInDB(req.params.id);
    }


    /** COMMON METHODS **/
    private saveUserInDB(user: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            user.save((err, usr) => {
                if (!err) {
                    console.info('[USERSERVICE] -- Set user "' + user.login + '" in DB success');
                    resolve(usr);
                }
                else {
                    var errorMessage = 'set user "' + user.login + '" in DB failure ' + err;
                    console.log('[USERSERVICE] -- ' + errorMessage);
                    reject(new Error(errorMessage));
                }
            });
        });
    }

    private getUserInDB = function (query: string, fields?: any) {
        return new Promise<any>((resolve, reject) => {
            User.findOne(query, fields, (err, user) => {
                if (!err) {
                    console.log('[USERSERVICE] -- Get user from DB success');
                    resolve(user);
                }
                else {
                    var errorMessage = 'Get user from DB failure' + err;
                    console.log('[USERSERVICE] -- ' + errorMessage);
                    reject(new Error(errorMessage));
                }
            });
        });
    }

    private getUsersInDB = function () {
        return new Promise<Array<any>>((resolve, reject) => {
            User.find({}, (err, users) => {
                if (!err) {
                    console.log('[USERSERVICE] -- Get users from DB success');
                    resolve(users);
                }
                else {
                    let errorMessage = 'Get users from DB failure' + err;
                    console.log('[USERSERVICE] -- ' + errorMessage);
                    reject(new Error(errorMessage));
                }
            });
        });
    }

    private removeUserInDB = function (login: string) {
        return new Promise((resolve, reject) => {
            User.findOneAndRemove({ login: login }, (err, data) => {
                if (!err) {
                    console.info("[USERSERVICE] removeUserFromDB : " + login + " successfully");
                    resolve();
                }
                else {
                    let errorMessage = 'Delete user : ' + login + 'failure ' + err;
                    console.log('[USERSERVICE] -- ' + errorMessage);
                    reject(new Error(errorMessage));
                }
            });
        });
    }

    private createSuperadmin = function () {
        return new Promise((resolve, reject) => {
            this.getUserInDB({ login: 'superadmin' })
                .then((user) => {
                    if (user) {
                        console.info("[USERSERVICE] -- Superadmin already created");
                        resolve(user);
                    }
                    else {
                        let user = new User({ "login": "superadmin", "password": "ert", rights:["user", "superadmin"] });
                        return this.saveUserInDB(user)
                            .then((user) => {
                                console.info("[USERSERVICE] -- Superadmin successfully created");
                                resolve(user);
                            });
                    }
                })
                .catch((error) => {
                    var errorMessage = `Superadmin creation failure ${error}`;
                    console.info(`[USERSERVICE] -- ${errorMessage}`);
                    reject(new Error(errorMessage));
                });
        });
    }



} 