import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnection } from 'typeorm';
import { DbMockService } from "./mocks/db-mock.service";
import * as fromDtoMocks from "./mocks/dto-mocks";

let dbMockService: DbMockService; // Should be initialized in every describe-block that requires data in db

const courses = fromDtoMocks.CoursesMock;
const groups = fromDtoMocks.GroupsMock;
const users = fromDtoMocks.UsersMock;
const assignments = fromDtoMocks.AssignmentsMock;
const assessments = fromDtoMocks.AssessmentsMock;

describe('GET-REQUESTS of CourseController (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		// Setup mocks
		const dbMockService = new DbMockService(getConnection());
		await dbMockService.createAll();
	});

	afterAll(async () => {
		await getConnection().dropDatabase(); // Drop database with all tables and data
		await getConnection().close(); // Close Db-Connection after all tests have been executed
	});

	it("(GET) /courses Retrieves all courses", () => {
		return request(app.getHttpServer())
			.get("/courses")
			.expect(({ body }) => {
				expect(body.length).toEqual(courses.length);
			});
	});

	it("(GET) /courses/{courseId} Retrieves the course", () => {
		return request(app.getHttpServer())
			.get(`/courses/${courses[0].id}`)
			.expect(({ body }) => {
				expect(body.id).toEqual(courses[0].id); 
			});
	});

	it("(GET) /courses/{name}/{semester} Retrieves the course", () => {
		return request(app.getHttpServer())
		.get(`/courses/${courses[0].shortname}/${courses[0].semester}`)
		.expect(({ body }) => {
			expect(body.id).toEqual(courses[0].id); 
		});
	});

	it("(GET) /courses/{courseId}/groups Retrieves all groups of a course", () => {
		return request(app.getHttpServer())
			.get(`/courses/${courses[0].id}/groups`)
			.expect(({ body }) => {
				expect(body.length).toEqual(groups.length); 
			});
	});

	it("(GET) /courses/{courseId}/assignments Retrieves all assignments of a course", () => {
		return request(app.getHttpServer())
			.get(`/courses/${courses[0].id}/assignments`)
			.expect(({ body }) => {
				expect(body.length).toEqual(assignments.length); 
			});
	});

	it("(GET) /courses/{courseId}/assignments/{assignmentId} Retrieves the assignment", () => {
		return request(app.getHttpServer())
			.get(`/courses/${assignments[0].courseId}/assignments/${assignments[0].id}`)
			.expect(({ body }) => {
				expect(body.id).toEqual(assignments[0].id);
			});
	});

	it("(GET) /courses/{courseId}/assignments/{assignmentId}/assessments Retrieves all assessments for the assignment", () => {
		return request(app.getHttpServer())
		.get(`/courses/${courses[0].id}/assignments/${assignments[0].id}/assessments`)
			.expect(({ body }) => {
				expect(body.length).toEqual(1); // There is only one assessment for this assignment
			});
	});

	it("(GET) /courses/{courseId}/assignment/{assignmentId}/assessments/{assessmentId} Retrieves the assessment", () => {
		return request(app.getHttpServer())
		.get(`/courses/${courses[0].id}/assignments/${assignments[0].id}/assessments/${assessments[0].id}`)
		.expect(({ body }) => {
			expect(body.id).toEqual(assessments[0].id); 
		});
	});

});

// TODO: Tests should fail when referenced foreign key is invalid, i.e doesn't exist (use JoinColumn?)
describe('POST-REQUESTS of CourseController (empty db) (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterEach(async () => {
		await getConnection().dropDatabase(); // Drop database with all tables and data
		await getConnection().close(); // Close Db-Connection after all tests have been executed
	});

	it("(POST) /courses Creates the given course and returns it (Part 1/2)", () => {
		return request(app.getHttpServer())
			.post("/courses")
			.send(courses[0])
			.expect(201)
			.expect(({ body }) => {
				expect(body.shortname).toEqual(courses[0].shortname); // Can't compare entire objects, because property "password" is not sent to clients
			})
	});

	it("(POST) /courses Creates the given course returns it (Part 2/2)", () => {
		return request(app.getHttpServer())
			.post("/courses")
			.send(courses[1])
			.expect(201)
			.expect(({ body }) => {
				expect(body.shortname).toEqual(courses[1].shortname); // Can't compare entire objects, because property "password" is not sent to clients
			})
	});

});

describe('POST-REQUESTS for relations (db contains data) of CourseController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		// Setup mocks - all of these tests require (at least) existing courses and users
		dbMockService = new DbMockService(getConnection());
		await dbMockService.createCourses();
		await dbMockService.createUsers();
	});

	afterEach(async () => {
		await getConnection().dropDatabase(); // Drop database with all tables and data
		await getConnection().close(); // Close Db-Connection after all tests have been executed
	});

	it("(POST) /courses/{courseId}/users/{userId} Adds the user to the course", () => {
		return request(app.getHttpServer())
			.post(`/courses/${courses[0].id}/users/${users[0].id}`)
			.expect(201)
	});

	it("(POST) /courses/{courseId}/groups Creates the given group and returns it (Part 1/2)", () => {
		return request(app.getHttpServer())
			.post(`/courses/${groups[0].courseId}/groups`)
			.send(groups[0]) // CourseId does not need to be specified here, because Course was created with given Id
			.expect(201)
			.expect(({ body }) => {
				expect(body.courseId).toEqual(groups[0].courseId);
				expect(body.name).toEqual(groups[0].name);
			})
	});

	it("(POST) /courses/{courseId}/groups Creates the given group and returns it (Part 2/2)", () => {
		return request(app.getHttpServer())
			.post(`/courses/${groups[1].courseId}/groups`)
			.send(groups[1]) // CourseId does not need to be specified here, because Course was created with given Id
			.expect(201)
			.expect(({ body }) => {
				expect(body.courseId).toEqual(groups[1].courseId);
				expect(body.name).toEqual(groups[1].name);
			})
	});

	it("(POST) /courses/{courseId}/assignments Creates the given assignment and returns it", () => {
		return request(app.getHttpServer())
			.post(`/courses/${assignments[0].courseId}/assignments`)
			.send(assignments[0]) // CourseId does not need to be specified here, because Course was created with given Id
			.expect(201)
			.expect(({ body }) => {
				expect(body.courseId).toEqual(assignments[0].courseId);
				expect(body.name).toEqual(assignments[0].name);
				expect(body.type).toEqual(assignments[0].type);
				expect(body.maxPoints).toEqual(assignments[0].maxPoints);
			});
	});

	// TODO: Verify that assessment-user-relation gets created
	it("(POST) /courses/{courseId}/assignments/{assignmentId}/assessments Creates the given (group-)assessment and returns it", async () => {
		// Setup
		await dbMockService.createGroups();
		await dbMockService.createAssignments();

		return request(app.getHttpServer())
			.post(`/courses/${assignments[0].courseId}/assignments/${assessments[0].assignmentId}/assessments`)
			.send(assessments[0])
			.expect(201)
			.expect(({ body }) => {
				expect(body.assignmentId).toEqual(assessments[0].assignmentId);
				expect(body.achievedPoints).toEqual(assessments[0].achievedPoints);
				expect(body.comment).toEqual(assessments[0].comment);
			});
	});

	// TODO: Verify that assessment-user-relation gets created
	it("(POST) /courses/{courseId}/assignments/{assignmentId}/assessments Creates the given (user-)assessment and returns it", async () => {
		// Setup
		await dbMockService.createAssignments();

		return request(app.getHttpServer())
			.post(`/courses/${assignments[1].courseId}/assignments/${assessments[1].assignmentId}/assessments`)
			.send(assessments[1])
			.expect(201)
			.expect(({ body }) => {
				expect(body.assignmentId).toEqual(assessments[1].assignmentId);
				expect(body.achievedPoints).toEqual(assessments[1].achievedPoints);
				expect(body.comment).toEqual(assessments[1].comment);
			});
	});

});

describe('POST-REQUESTS for relations (db contains data) of CourseController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		// Setup mocks - all of these tests require (at least) existing courses and users
		dbMockService = new DbMockService(getConnection());
		await dbMockService.createCourses();
		await dbMockService.createUsers();
	});

	afterEach(async () => {
		await getConnection().dropDatabase(); // Drop database with all tables and data
		await getConnection().close(); // Close Db-Connection after all tests have been executed
	});

	it("(POST) /courses/{courseId}/users/{userId} Adds the user to the course", () => {
		return request(app.getHttpServer())
			.post(`/courses/${courses[0].id}/users/${users[0].id}`)
			.expect(201)
	});

	it("(POST) /courses/{courseId}/groups Creates the given group and returns it (Part 1/2)", () => {
		return request(app.getHttpServer())
			.post(`/courses/${groups[0].courseId}/groups`)
			.send(groups[0]) // CourseId does not need to be specified here, because Course was created with given Id
			.expect(201)
			.expect(({ body }) => {
				expect(body.courseId).toEqual(groups[0].courseId);
				expect(body.name).toEqual(groups[0].name);
			})
	});

	it("(POST) /courses/{courseId}/groups Creates the given group and returns it (Part 2/2)", () => {
		return request(app.getHttpServer())
			.post(`/courses/${groups[1].courseId}/groups`)
			.send(groups[1]) // CourseId does not need to be specified here, because Course was created with given Id
			.expect(201)
			.expect(({ body }) => {
				expect(body.courseId).toEqual(groups[1].courseId);
				expect(body.name).toEqual(groups[1].name);
			})
	});

	it("(POST) /courses/{courseId}/assignments Creates the given assignment and returns it", () => {
		return request(app.getHttpServer())
			.post(`/courses/${assignments[0].courseId}/assignments`)
			.send(assignments[0]) // CourseId does not need to be specified here, because Course was created with given Id
			.expect(201)
			.expect(({ body }) => {
				expect(body.courseId).toEqual(assignments[0].courseId);
				expect(body.name).toEqual(assignments[0].name);
				expect(body.type).toEqual(assignments[0].type);
				expect(body.maxPoints).toEqual(assignments[0].maxPoints);
			});
	});

	// TODO: Verify that assessment-user-relation gets created
	it("(POST) /courses/{courseId}/assignments/{assignmentId}/assessments Creates the given (group-)assessment and returns it", async () => {
		// Setup
		await dbMockService.createGroups();
		await dbMockService.createAssignments();

		return request(app.getHttpServer())
			.post(`/courses/${assignments[0].courseId}/assignments/${assessments[0].assignmentId}/assessments`)
			.send(assessments[0])
			.expect(201)
			.expect(({ body }) => {
				expect(body.assignmentId).toEqual(assessments[0].assignmentId);
				expect(body.achievedPoints).toEqual(assessments[0].achievedPoints);
				expect(body.comment).toEqual(assessments[0].comment);
			});
	});

	// TODO: Verify that assessment-user-relation gets created
	it("(POST) /courses/{courseId}/assignments/{assignmentId}/assessments Creates the given (user-)assessment and returns it", async () => {
		// Setup
		await dbMockService.createAssignments();

		return request(app.getHttpServer())
			.post(`/courses/${assignments[1].courseId}/assignments/${assessments[1].assignmentId}/assessments`)
			.send(assessments[1])
			.expect(201)
			.expect(({ body }) => {
				expect(body.assignmentId).toEqual(assessments[1].assignmentId);
				expect(body.achievedPoints).toEqual(assessments[1].achievedPoints);
				expect(body.comment).toEqual(assessments[1].comment);
			});
	});

});

