import { PassedXPercentWithAtLeastYPercent } from "../abstract-rules";
import { AssignmentDto } from "../../../course/dto/assignment/assignment.dto";
import { RoundingMethod, ofPercent, Percent } from "../../../utils/math";
import { AssignmentId } from "../../../course/entities/assignment.entity";
import { AssessmentDto } from "../../../course/dto/assessment/assessment.dto";
import { RuleCheckResult } from "../../dto/rule-check-result.dto";

export class PassedXPercentWithAtLeastYPercentImpl extends PassedXPercentWithAtLeastYPercent {

	private countOfAssignmentsThatStudentMustPass: number;
	private roundRequiredAssignments: (value: number) => number;
	private roundAchievedPercent: (value: number) => number;

	/** [AssignmentId, Rounded points required to pass] */
	private requiredPointsToPass = new Map<AssignmentId, number>();

	constructor(rule: Partial<PassedXPercentWithAtLeastYPercent>, assignments: AssignmentDto[]) {
		super();
		Object.assign(this, rule);
		
		this.roundAchievedPercent = RoundingMethod(this.achievedPercentRounding.type, this.achievedPercentRounding.decimals);
		this.roundRequiredAssignments = RoundingMethod(this.passedAssignmentsRounding.type, this.passedAssignmentsRounding.decimals);
		
		const relevantAssignments = this.filterAssignmentsByType(assignments);
		const requiredAssignmentCount = ofPercent(relevantAssignments.length, this.passedAssignmentsPercent);
		
		this.countOfAssignmentsThatStudentMustPass = this.roundRequiredAssignments(requiredAssignmentCount);

		relevantAssignments.forEach(assignment => {
			this.requiredPointsToPass.set(assignment.id, assignment.points);
		});
	}

	/**
	 * Checks each assessment of a student to determine, wether he passed it or not (by achieving the required percentage)
	 * The rule is passed, if the student passed the required amount of assignments or more.
	 */
	check(assessments: AssessmentDto[]): RuleCheckResult {
		const relevantAssessments = this.filterAssessmentsByType(assessments);
		const achievedPoints = this.mapAchievedPointsToAssignment(relevantAssessments);
		const passedAssignments = this.countPassedAssignments(achievedPoints);

		const result: RuleCheckResult = {
			achievedPoints: passedAssignments,
			achievedPercent: Percent(passedAssignments, this.countOfAssignmentsThatStudentMustPass),
			passed: passedAssignments >= this.countOfAssignmentsThatStudentMustPass,
			_rule: this.type,
			_assignmentType: this.assignmentType
		};
		return result;
	}

	/**
	 * Returns the count of passed assignments.
	 * @param achievedPoints Map of [assignmentId, achievedPoints]
	 */
	private countPassedAssignments(achievedPoints: Map<AssignmentId, number>) {
		let passedAssignments = 0;
		this.requiredPointsToPass.forEach((requiredPoints, assignmentId) => {
			if (this.studentPassedAssignment(achievedPoints, assignmentId)) {
				passedAssignments++;
			}
		});
		return passedAssignments;
	}

	/**
	 * Determines, wether the student has achieved enough points to pass the assignment.
	 * @param achievedPoints Map of [assignmentId, achievedPoints]
	 * @param assignmentId Assignment that should be checked
	 */
	private studentPassedAssignment(achievedPoints: Map<AssignmentId, number>, assignmentId: AssignmentId): boolean {
		const achievedPercent = Percent(achievedPoints.get(assignmentId), this.requiredPointsToPass.get(assignmentId));
		const achievedPercentRounded = this.roundAchievedPercent(achievedPercent);
		return achievedPercentRounded >= this.requiredPercent;
	}

	/**
	 *
	 *
	 * @private
	 * @param relevantAssessments
	 * @returns
	 */
	private mapAchievedPointsToAssignment(relevantAssessments: AssessmentDto[]): Map<string, number> {
		const map = new Map<AssignmentId, number>();
		relevantAssessments.forEach(assessment => {
			map.set(assessment.assignmentId, assessment.achievedPoints);
		});
		return map;
	}

} 
