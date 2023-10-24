"use client";

import { FieldValues, UseFormRegister } from "react-hook-form";

interface CustomCheckProps {
  id: string;
  label: string;
  disabled?: boolean;
  register: UseFormRegister<FieldValues>;
}

const CustomCheckBox: React.FC<CustomCheckProps> = ({
  id,
  label,
  disabled,
  register,
}) => {
  return (
    <div className='w-full flex flex-row gap-2 items-center'>
      <input
        type='checkbox'
        id={id}
        disabled={disabled}
        {...register(id)}
        placeholder=''
        className='cursor-pointer'
      />
      <label htmlFor={id} className='font-medium cursor-pointer'>
        {label}
      </label>
    </div>
  );
};

export default CustomCheckBox;
