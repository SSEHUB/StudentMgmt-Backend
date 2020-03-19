import { UserDto } from "../../src/shared/dto/user.dto";
import { UserRole, CourseRole } from "../../src/shared/enums";
import { User } from "../../src/shared/entities/user.entity";
import { CourseUserRelationsMock } from "./relations.mock";
import { CourseUserRelation } from "../../src/shared/entities/course-user-relation.entity";

export const USER_STUDENT_JAVA: UserDto = {
	id: "a019ea22-5194-4b83-8d31-0de0dc9bca53",
	email: "max.mustermann@test.com",
	username: "Max Mustermann",
	rzName: "mmustermann",
	role: UserRole.USER,
};

export const USER_STUDENT_2_JAVA: UserDto = {
	id: "40f59aad-7473-4455-a3ea-1214f19b2565",
	email: "hans.peter@test.com",
	username: "Hans Peter",
	rzName: "hpeter",
	role: UserRole.USER,
};

export const USER_STUDENT_3_JAVA_TUTOR: UserDto = {
	id: "8330300e-9be7-4a70-ba7d-8a0139311343",
	email: "john.doe@test.com",
	username: "John Doe",
	rzName: "jdoe",
	role: UserRole.USER,
};

export const USER_MGMT_ADMIN_JAVA_LECTURER: UserDto = {
	id: "c17b67ea-d0b7-46bc-a2e0-ea2ec18f441d",
	email: "mgtm.admin@test.com",
	username: "Mgtm Admin",
	rzName: "mAdmin",
	role: UserRole.MGMT_ADMIN,
};

export const USER_SYSTEM_ADMIN: UserDto = {
	id: "d4b50fe8-f949-4317-bdde-d9ae61f53b96",
	email: "system.admin@test.com",
	username: "System Admin",
	rzName: "sAdmin",
	role: UserRole.SYSTEM_ADMIN,
};

export const UsersMock: UserDto[] = [
	USER_STUDENT_JAVA, 
	USER_STUDENT_2_JAVA,
	USER_STUDENT_3_JAVA_TUTOR,
	USER_MGMT_ADMIN_JAVA_LECTURER,
	USER_SYSTEM_ADMIN
];

export function getUsersOfCourseMock(): User[] {
	const participants: UserDto[] = [
		USER_STUDENT_JAVA, 
		USER_STUDENT_2_JAVA,
		USER_STUDENT_3_JAVA_TUTOR,
		USER_MGMT_ADMIN_JAVA_LECTURER
	];

	const users: User[] = [];

	participants.forEach(p => {
		const user = new User();
		user.id = p.id;
		user.email = p.email;
		user.username = p.username;
		user.rzName = p.rzName;
		user.role = p.role;
		user.courseUserRelations = [new CourseUserRelation()];
		user.courseUserRelations[0].courseId = "java-wise1920";
		user.courseUserRelations[0].userId = p.id;
		user.courseUserRelations[0].role = CourseRole.STUDENT;

		users.push(user);
	});

	return users;
}