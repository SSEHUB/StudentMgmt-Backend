// import { Injectable } from "@nestjs/common";
import { getConnection, Connection } from "typeorm";
import { User } from "../../src/shared/entities/user.entity";
import { Group } from "../../src/shared/entities/group.entity";
import { Course } from "../../src/shared/entities/course.entity";
import { Assignment } from "../../src/shared/entities/assignment.entity";
import { Assessment } from "../../src/shared/entities/assessment.entity";
import * as fromDtoMocks from "./dto-mocks";
import { CourseUserRelation } from "../../src/shared/entities/course-user-relation.entity";
import { AssessmentUserRelation } from "../../src/shared/entities/assessment-user-relation.entity";
import { UserGroupRelation } from "../../src/shared/entities/user-group-relation.entity";

// TODO: Replace console logs with logger 
//@Injectable() Not a "real" (injectable) service for now
export class DbMockService {

	private con: Connection;
	courses = fromDtoMocks.CoursesMock;
	groups = fromDtoMocks.GroupsMock;
	users = fromDtoMocks.UsersMock;
	assignments = fromDtoMocks.AssignmentsMock;
	assessments = fromDtoMocks.AssessmentsMock;
	courseUserRelations = fromDtoMocks.CourseUserRelationsMock;
	userGroupRelations = fromDtoMocks.UserGroupRelationsMock;
	assessmentUserRelations = fromDtoMocks.AssessmentUserRelationsMock;
	
	constructor(connection: Connection) { 
		this.con = connection;
	}

	/**
	 * Fills the database with test data.
	 * @memberof DbMockService
	 */
	async createAll(): Promise<void> {
		//console.log("Creating mock data...");
		await this.createCourses();
		await this.createUsers();
		await this.createGroups();
		await this.createAssignments();
		await this.createAssessments();
		await this.createCourseUserRelations();
		await this.createUserGroupRelations();
		await this.createAssessmentUserRelations();
	}

	async createCourses(): Promise<void> {
		const result = await this.con.getRepository<Course>(Course).insert(this.courses);
		//console.log("Creating courses...");
		//console.log(result.identifiers);
	}

	async createUsers(): Promise<void> {
		const result = await this.con.getRepository<User>(User).insert(this.users);
		//console.log("Creating Users...");
		//console.log(result.identifiers);
	}

	async createGroups(): Promise<void> {
		const result = await this.con.getRepository<Group>(Group).insert(this.groups);
		//console.log("Creating Groups...");
		//console.log(result.identifiers);
	}

	async createAssignments(): Promise<void> {
		const result = await this.con.getRepository<Assignment>(Assignment).insert(this.assignments);
		//console.log("Creating Assignments...");
		//console.log(result.identifiers);
	}

	async createAssessments(): Promise<void> {
		const result = await this.con.getRepository<Assessment>(Assessment).insert(this.assessments);
		//console.log("Creating Assessments...");
		//console.log(result.identifiers);
	}

	async createCourseUserRelations(): Promise<void> {
		const result = await this.con.getRepository<CourseUserRelation>(CourseUserRelation).insert(this.courseUserRelations);
		//console.log("Creating CourseUserRelations...");
		//console.log(result.identifiers);
	}

	async createAssessmentUserRelations(): Promise<void> {
		const result = await this.con.getRepository<AssessmentUserRelation>(AssessmentUserRelation).insert(this.assessmentUserRelations);
		//console.log("Creating AssessmentUserRelations...");
		//console.log(result.identifiers);
	}

	async createUserGroupRelations(): Promise<void> {
		const result = await this.con.getRepository<UserGroupRelation>(UserGroupRelation).insert(this.userGroupRelations);
		//console.log("Creating UserGroupRelations...");
		//console.log(result.identifiers);
	}

}
