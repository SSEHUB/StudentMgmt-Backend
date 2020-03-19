import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "../../src/app.module";

/**
 * Creates and returns an initialized NestApplication for e2e-testing purposes.
 */
export async function createApplication(): Promise<INestApplication> {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	const app = moduleFixture.createNestApplication();
	await app.init();
	
	return app;
}

/**
 * Returns the imports that are required by all TestingModules.
 */
export function getImports(): any[] {
	const imports = [

	];
	return imports;
}