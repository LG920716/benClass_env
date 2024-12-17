// User Types
export interface User {
  id: string;
  name: string;
  password: string;
  role: string;
  gender: number;
  courses_enrolled: string[];
  classes_enrolled: string[];
  class_scores: Record<string, number>;
  total_score: number;
}

export interface UserResponse {
  id: string;
  name: string;
  role: string;
  gender: number;
  courses_enrolled: string[];
  classes_enrolled: string[];
  class_scores: Record<string, number>;
  total_score: number;
}

export interface UserLoginRequest {
  id: string;
  password: string;
}

export interface UserLoginResponse {
  id: string;
  name: string;
  role: string;
  gender: number;
  token?: string;
}

export interface UserCreateRequest {
  id: string;
  name: string;
  password: string;
  role: string;
  gender: number;
}

export interface UserUpdateRequest{
    name?: string;
    password?: string;
    gender?: number;
    role?: string;
}

export interface UserEnrollRequest {
  enroll_type: "COURSE" | "CLASS";
  enroll_id: string;
}

// Course Types
export interface Course {
  id: string;
  course_name: string;
  teacher_name: string;
  students: string[];
  classes: string[];
}

export interface CourseCreateRequest {
  course_name: string;
  teacher_name: string;
}

export interface CourseUpdateRequest {
  action: "ADD" | "DELETE" | "UPDATE";
  student?: string;
  students?: string[];
  classes?: string[];
  course_name?: string;
  teacher_name?: string;
}

// Class Types
export interface Class {
  id: string;
  course_id: string;
  date: string;
  enrolled_students: string[];
  groups: Record<string, string[]>[];
}

export interface ClassCreateRequest {
  date: string;
  course_id: string;
}

export interface ClassUpdateRequest {
  action: "ADD" | "DELETE" | "UPDATE";
  date?: string;
  student?: string;
  students?: string[];
}

// Score Types
export interface RoundUpdate {
  round_number: number;
  scores: Record<string, number>;
}

export interface MatchUpdate {
  match_number: number;
  rounds: RoundUpdate[];
}

export interface ScoreUpdateRequest {
  matches: MatchUpdate[];
}

export interface ScoreResponse {
  class_id: string;
  matches: MatchUpdate[];
}
