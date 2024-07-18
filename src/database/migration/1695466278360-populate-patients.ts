import * as bcrypt from 'bcrypt'
import * as fs from 'fs/promises'
import * as path from 'path'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { SALT_ROUNDS } from '../../common/constant'
import { PatientEntity } from '../entity/patient.entity'
import { UserEntity } from '../entity/user.entity'

export class PopulatePatients1695466278360 implements MigrationInterface {
  name = 'PopulatePatients1695466278360'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const seedDataPath = path.join(
      __dirname,
      '../../../seed/',
      'patients.seed.json'
    )
    const seedData = await fs.readFile(seedDataPath, { encoding: 'utf-8' })
    const patientsData: [{ user: UserEntity } & PatientEntity] =
      JSON.parse(seedData)

    const users: UserEntity[] = patientsData.map((p) => ({
      ...p.user,
      password: bcrypt.hashSync(p.user.password!, SALT_ROUNDS),
    }))
    const userRepository = queryRunner.connection.getRepository(UserEntity)
    await userRepository.insert(users)

    const patients: PatientEntity[] = await Promise.all(
      patientsData.map(
        async (p) =>
          ({
            ...p,
            user: await userRepository.findOneBy({ email: p.user.email })!,
          } as PatientEntity)
      )
    )
    const patientRepository =
      queryRunner.connection.getRepository(PatientEntity)
    await patientRepository.insert(patients)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
