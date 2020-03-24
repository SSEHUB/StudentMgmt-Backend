import { Repository, EntityRepository } from "typeorm";
import { User } from "../../shared/entities/user.entity";
import { UserDto } from "../../shared/dto/user.dto";
import { Course } from "src/shared/entities/course.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

	async createUser(userDto: UserDto): Promise<User> {
		const user = this.createEntityFromDto(userDto);
		return user.save();
	}

	async getAllUsers(): Promise<User[]> {
		return this.find();
	}

	async getUserById(id: string): Promise<User> {
		return this.findOne(id, { relations: ["courseUserRelations", "courseUserRelations.course"] });
	}

	async getUserByEmail(email: string): Promise<User> {
		return this.findOne({
			where: { email },
			relations: ["courseUserRelations", "courseUserRelations.course"]
		});
	}

	async getCoursesOfUser(userId: string): Promise<Course[]> {
		const user = await this.findOne(userId, { relations: ["courseUserRelations", "courseUserRelations.course"] });
		const courses = [];

		if (user.courseUserRelations) {
			user.courseUserRelations.forEach(courseUserRelation => {
				courses.push(courseUserRelation.course);
			});
		}

		return courses;
	}

	async updateUser(userId: string, userDto: UserDto): Promise<User> {
		const user = await this.getUserById(userId);

		// TODO: Define Patch-Object or create method
		user.email = userDto.email;
		user.role = userDto.role;

		return user.save();
	}

	async deleteUser(userId: string): Promise<boolean> {
		const deleted = await this.remove(this.create({ id: userId }));
		return deleted ? true : false;
	}
	
	private createEntityFromDto(userDto: UserDto): User {
		const user = new User();
		user.email = userDto.email;
		user.role = userDto.role;
		user.username = userDto.username;
		user.rzName = userDto.rzName;
		return user;
	}
}
