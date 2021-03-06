import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationFilter } from "../../../shared/pagination.filter";
import { GroupDto } from "../../../course/dto/group/group.dto";
import { transformBoolean } from "../../../../test/utils/http-utils";

export class GroupWithAssignedEvaluatorDto {
	group: GroupDto;

	@ApiPropertyOptional({ description: "UserId of the assigned evaluator (for assignment)." })
	assignedEvaluatorId?: string;

	@ApiPropertyOptional({ description: "Id of the assessment, if it exists." })
	assessmentId?: string;
}

export class AssignedEvaluatorFilter extends PaginationFilter {
	@ApiPropertyOptional({ description: "Filter by assigned evaluator." })
	assignedEvaluatorId?: string;

	@ApiPropertyOptional({ description: "Excludes groups/users that have already been reviewed." })
	excludeAlreadyReviewed?: boolean;

	@ApiPropertyOptional({ description: "Filter by group or username." })
	nameOfGroupOrUser?: string;

	constructor(filter: Partial<AssignedEvaluatorFilter>) {
		super(filter);
		this.assignedEvaluatorId = filter?.assignedEvaluatorId;
		this.nameOfGroupOrUser = filter?.nameOfGroupOrUser;
		this.excludeAlreadyReviewed = transformBoolean(filter?.excludeAlreadyReviewed);
	}
}
