"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};
function CreatePage() {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  function onSubmit(data: FormInput) {
    window.alert(JSON.stringify(data));
    return true;
  }
  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img
        src="/github.png"
        alt="version control"
        className="h-56 w-auto"
      />
      <div>
        <div>
          <h1 className="text-2xl font-semibold">
            Connect your Github account
          </h1>
          <p className="text-muted-foregorund text-sm">
            enter the Url of the repository you want to connect
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input {...register("projectName",{required:true})} 
            placeholder="Project Name"/>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
