import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, BeforeInsert, BeforeUpdate, Check } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Entity('users')
@Check('password_min_length', 'LENGTH(password) >= 8')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    name: string;

    @Column({ nullable: false })
    email: string;

    @Column({
        nullable: false,
        length: 128,
        comment: 'User password - minimum 8 characters required'
    })
    password: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 12)
        }
    }
}
