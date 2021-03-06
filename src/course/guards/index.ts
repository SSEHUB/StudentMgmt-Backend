import { AssignmentGuard } from "./assignment.guard";
import { CourseMemberGuard } from "./course-member.guard";
import { GroupGuard } from "./group.guard";
import { ParticipantIdentityGuard } from "./identity.guard";
import { SelectedParticipantGuard } from "./selected-participant.guard";
import { TeachingStaffGuard } from "./teaching-staff.guard";

export const Guards = [
	AssignmentGuard,
	CourseMemberGuard,
	GroupGuard,
	ParticipantIdentityGuard,
	SelectedParticipantGuard,
	TeachingStaffGuard
];
