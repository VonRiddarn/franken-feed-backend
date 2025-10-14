import * as userRepo from "../repositories/userRepository.js";

export const getUsersAll = userRepo.findAllUsers;
export const getUserById = userRepo.findUserById;
export const getUserByUsername = userRepo.findByUsername;
export const getUserBySearchParam = userRepo.findBySearchParam;
export const registerUser = userRepo.createUser;
