import axios from 'axios';
import { UserCreateRequest, UserUpdateRequest, UserLoginRequest, UserLoginResponse, UserResponse, UserEnrollRequest, CourseCreateRequest, CourseUpdateRequest, Course, Class, ClassUpdateRequest, ClassCreateRequest, ScoreUpdateRequest, ScoreResponse } from '../../interface/types';

const BASE_URL = "http://localhost:8000";

// User API
export const registerUser = async (data: UserCreateRequest): Promise<UserResponse> => {
  const response = await axios.post(`${BASE_URL}/users/register`, data);
  return response.data;
};

export const updateUser = async (id: string, data: UserUpdateRequest): Promise<UserResponse> => {
  const response = await axios.patch(`${BASE_URL}/users/update/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<string> => {
  const response = await axios.delete(`${BASE_URL}/users/delete/${id}`);
  return response.data;
};

export const getUserByCourseId = async (course_id: string): Promise<UserResponse[]> => {
  const response = await axios.get(`${BASE_URL}/users/query/${course_id}`);
  return response.data;
};

export const findUserOrderByScore = async (course_id: string): Promise<UserResponse[]> => {
  const response = await axios.get(`${BASE_URL}/users/${course_id}/score`);
  return response.data;
}

export const getUserById = async (id: string): Promise<UserResponse> => {
  const response = await axios.get(`${BASE_URL}/users/${id}`);
  return response.data;
};

export const loginUser = async (data: UserLoginRequest): Promise<UserLoginResponse> => {
  const response = await axios.post(`${BASE_URL}/users/login`, data);
  return response.data;
};

export const enrollUser = async (id: string, data: UserEnrollRequest): Promise<UserResponse> => {
  const response = await axios.patch(`${BASE_URL}/users/${id}/enroll`, data);
  return response.data;
};

export const userScoreUpdate = async (class_id: string): Promise<string> => {
  const response = await axios.patch(`${BASE_URL}/users/score_update/${class_id}`);
  return response.data;
};

// Course API
export const createCourse = async (data: CourseCreateRequest): Promise<Course> => {
  const response = await axios.post(`${BASE_URL}/courses`, data);
  return response.data;
};

export const updateCourse = async (course_id: string, data: CourseUpdateRequest): Promise<Course> => {
  const response = await axios.patch(`${BASE_URL}/courses/${course_id}`, data);
  return response.data;
};

export const getCourseByTeacher = async (teacher_name: string): Promise<Course[]> => {
  const response = await axios.get(`${BASE_URL}/courses/by-teacher/${teacher_name}`);
  return response.data;
};

export const deleteCourse = async (course_id: string): Promise<string> => {
  const response = await axios.delete(`${BASE_URL}/courses/${course_id}`);
  return response.data;
};

export const getCourse = async (course_id: string): Promise<Course> => {
  const response = await axios.get(`${BASE_URL}/courses/${course_id}`);
  return response.data;
};

// Class API
export const createClass = async (data: ClassCreateRequest): Promise<Class> => {
  const response = await axios.post(`${BASE_URL}/classes`, data);
  return response.data;
};

export const updateClass = async (id: string, data: ClassUpdateRequest): Promise<Class> => {
  const response = await axios.patch(`${BASE_URL}/classes/${id}`, data);
  return response.data;
};

export const deleteClass = async (id: string): Promise<string> => {
  const response = await axios.delete(`${BASE_URL}/classes/${id}`);
  return response.data;
};

export const getClass = async (id: string): Promise<Class> => {
  const response = await axios.get(`${BASE_URL}/classes/${id}`);
  return response.data;
};

export const groupClass = async (id: string): Promise<string> => {
  const response = await axios.patch(`${BASE_URL}/classes/${id}/grouping`);
  return response.data;
};

// Score API
export const updateScore = async (class_id: string, data: ScoreUpdateRequest): Promise<ScoreResponse> => {
  const response = await axios.patch(`${BASE_URL}/scores/${class_id}`, data);
  return response.data;
};

export const getScore = async (class_id: string): Promise<ScoreResponse> => {
  const response = await axios.get(`${BASE_URL}/scores/${class_id}`);
  return response.data;
};