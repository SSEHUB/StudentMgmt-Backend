import { ExecutionContext } from "@nestjs/common";
import { copy, convertToEntity } from "../utils/object-helper";
import { USER_SYSTEM_ADMIN, USER_MGMT_ADMIN_JAVA_LECTURER } from "./users.mock";
import { Participant as ParticipantEntity } from "../../src/course/entities/participant.entity";
import { User } from "../../src/shared/entities/user.entity";
import { CourseRole } from "../../src/shared/enums";
import { Course as CourseEntity } from "../../src/course/entities/course.entity";
import { COURSE_JAVA_1920 } from "./courses.mock";
import { Course } from "../../src/course/models/course.model";
import { Participant } from "../../src/course/models/participant.model";

export class AuthGuardMock { 
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		request.user = copy(USER_SYSTEM_ADMIN);
		return true; 
	}
}

export class RoleGuardMock { canActivate(): boolean { return true; }}

export class CourseMemberGuardMock { 
	canActivate(context: ExecutionContext): boolean { 
		const request = context.switchToHttp().getRequest();
		
		const course = convertToEntity(CourseEntity, COURSE_JAVA_1920);
		const participant = new ParticipantEntity({
			userId: USER_MGMT_ADMIN_JAVA_LECTURER.id,
			user: convertToEntity(User, USER_MGMT_ADMIN_JAVA_LECTURER),
			role: CourseRole.LECTURER
		});
		
		request.course = new Course(course);
		request.participant = new Participant(participant);

		return true; 
	}
}
