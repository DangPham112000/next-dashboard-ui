"use server";

import { revalidatePath } from "next/cache";
import {
  ClassSchema,
  ExamSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchema";
import { prisma } from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { getUserId, getUserRole } from "./helpers";

type CurrentState = {
  success: boolean;
  error: boolean;
};

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: { id: data.id },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = data.get("id") as string;

    await prisma.subject.delete({
      where: { id: parseInt(id) },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.create({ data });

    // revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
      where: { id: data.id },
      data,
    });

    // revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = data.get("id") as string;

    await prisma.class.delete({
      where: { id: parseInt(id) },
    });

    // revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: {
        role: "teacher",
      },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.firstName,
        surname: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: new Date(data.birthday),
        subjects: {
          connect: data.subjects.map((subjectId) => ({ id: subjectId })),
        },
        classes: {
          connect: data.classes.map((classId) => ({ id: classId })),
        },
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }

  try {
    const clerk = await clerkClient();
    await clerk.users.updateUser(data.id, {
      username: data.username,
      ...(data.password && { password: data.password }),
      firstName: data.firstName,
      lastName: data.lastName,
    });
  } catch (error) {
    console.error(error);
  }

  try {
    await prisma.teacher.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.firstName,
        surname: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: new Date(data.birthday),
        subjects: {
          set: data.subjects.map((subjectId) => ({ id: subjectId })),
        },
        classes: {
          set: data.classes.map((classId) => ({ id: classId })),
        },
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = data.get("id") as string;

    const clerk = await clerkClient();
    await clerk.users.deleteUser(id);

    await prisma.teacher.delete({
      where: { id },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  try {
    let user: any;
    const clerk = await clerkClient();

    try {
      user = await clerk.users.createUser({
        username: data.username,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        publicMetadata: {
          role: "student",
        },
      });
    } catch (error) {
      console.error(error);
      return { success: false, error: true };
    }

    try {
      const cls = await prisma.class.findUnique({
        where: { id: data.classId },
        select: { grade: { select: { id: true } } },
      });
      await prisma.student.create({
        data: {
          id: user.id,
          username: data.username,
          name: data.firstName,
          surname: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          img: data.img,
          bloodType: data.bloodType,
          sex: data.sex,
          birthday: new Date(data.birthday),
          classId: data.classId,
          gradeId: cls?.grade.id!,
          parentId: data.parentId,
        },
      });

      // revalidatePath("/list/students");
      return { success: true, error: false };
    } catch (error) {
      console.error(error);
      await clerk.users.deleteUser(user.id);
      return { success: false, error: true };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }

  try {
    const clerk = await clerkClient();
    await clerk.users.updateUser(data.id, {
      username: data.username,
      ...(data.password && { password: data.password }),
      firstName: data.firstName,
      lastName: data.lastName,
    });
  } catch (error) {
    console.error(error);
  }

  const cls = await prisma.class.findUnique({
    where: { id: data.classId },
    select: { grade: { select: { id: true } } },
  });
  try {
    await prisma.student.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.firstName,
        surname: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: new Date(data.birthday),
        classId: data.classId,
        gradeId: cls?.grade.id!,
        parentId: data.parentId,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = data.get("id") as string;

    const clerk = await clerkClient();
    await clerk.users.deleteUser(id);

    await prisma.student.delete({ where: { id } });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  try {
    const role = await getUserRole();
    if (role === "teacher") {
      const userId = await getUserId();
      const teacherLesson = await prisma.lesson.findFirst({
        where: { id: data.lessonId, teacherId: userId },
      });

      if (!teacherLesson) return { success: false, error: true };
    }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const role = await getUserRole();
    if (role === "teacher") {
      const userId = await getUserId();
      const teacherLesson = await prisma.lesson.findFirst({
        where: { id: data.lessonId, teacherId: userId },
      });

      if (!teacherLesson) return { success: false, error: true };
    }
    
    await prisma.exam.update({
      where: { id: data.id },
      data: {
        title: data.title,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const userId = await getUserId();
    const role = await getUserRole();
    const id = data.get("id") as string;

    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher" ? { lesson: { teacherId: userId } } : {}),
      },
    });

    // revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};
