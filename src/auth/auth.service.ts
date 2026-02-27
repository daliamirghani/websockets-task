import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import fs from 'fs';
import bcrypt from "bcrypt";
import { SignUpDto } from '../dtos/signUpDto'
import { LoginDto } from '../dtos/loginDto'
import path from 'path';
import { error } from 'console';

let users =JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'users.json'), 'utf-8'));
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signUp(dto: SignUpDto) {
    const{ username, password,role, email} = dto;
    if (users.find(user=> user.username == username))
      throw new BadRequestException('Username is taken already!');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = {username,password:hashedPassword, role , email};
    users.push(user);
    fs.writeFileSync(
    path.join(process.cwd(), 'data', 'users.json'),
    JSON.stringify(users, null, 2),'utf-8');
    console.log("USER:", user);
    console.log("ROLE:", user?.role);

    console.log("user created successfully");
  }

  async login(dto: LoginDto) {
     let token ='';
    const currentUser = users.find(u => u.username === dto.username);
    if (currentUser) {
      const match = await bcrypt.compare(dto.password, currentUser.password);
      if (match)
       { console.log("logged in successfully!");
          token = this.jwtService.sign({ username: currentUser.username, role: currentUser.role, email:currentUser.email });
       }
       else 
       {
        throw new BadRequestException('Wrong username or password!');
       }
    }
    else
      throw new BadRequestException('Wrong username or password!');
    console.log("TOKEN:", token);
    return token;
  }
}