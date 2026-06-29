import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, upsertProfile } from '../../api/students';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { BRANCHES } from '../../utils/constants';
import toast from 'react-hot-toast';

const schema = z.object({
  rollNo: z.string().min(1, 'Roll number is required'),
  branch: z.string().min(1, 'Branch is required'),
  cgpa: z.coerce.number().min(0, 'Min 0').max(10, 'Max 10'),
  passingYear: z.coerce.number().min(2020).max(2035),
  backlogCount: z.coerce.number().min(0),
});

export default function Profile() {
  const { data, isLoading } = useQuery({ queryKey: ['my-profile'], queryFn: () => getMyProfile().then((r) => r.data).catch(() => null) });
  const qc = useQueryClient();
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const student = data?.student;

  useEffect(() => {
    if (student) {
      reset({
        rollNo: student.rollNo || '',
        branch: student.branch || '',
        cgpa: student.cgpa || 0,
        passingYear: student.passingYear || 2026,
        backlogCount: student.backlogCount || 0,
      });
    }
  }, [student, reset]);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => formData.append(k, v));
      if (resumeFile) formData.append('resume', resumeFile);
      await upsertProfile(formData);
      toast.success('Profile saved successfully!');
      qc.invalidateQueries({ queryKey: ['my-profile'] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    }
    setSubmitting(false);
  };

  if (isLoading) return <LoadingSkeleton type="cards" rows={2} />;

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md font-semibold">My Profile</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Edit Form */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0px_1px_3px_rgba(15,23,42,0.08)] p-6">
          <h3 className="text-title-md font-semibold mb-6">Edit Profile</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-label-md text-on-surface-variant mb-1">Roll Number *</label>
              <input {...register('rollNo')} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
              {errors.rollNo && <p className="text-error text-body-sm mt-1">{errors.rollNo.message}</p>}
            </div>
            <div>
              <label className="block text-label-md text-on-surface-variant mb-1">Branch *</label>
              <select {...register('branch')} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary">
                <option value="">Select branch</option>
                {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              {errors.branch && <p className="text-error text-body-sm mt-1">{errors.branch.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-label-md text-on-surface-variant mb-1">CGPA *</label>
                <input type="number" step="0.01" {...register('cgpa')} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
                {errors.cgpa && <p className="text-error text-body-sm mt-1">{errors.cgpa.message}</p>}
              </div>
              <div>
                <label className="block text-label-md text-on-surface-variant mb-1">Passing Year *</label>
                <input type="number" {...register('passingYear')} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
              </div>
            </div>
            <div>
              <label className="block text-label-md text-on-surface-variant mb-1">Backlog Count</label>
              <input type="number" {...register('backlogCount')} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-label-md text-on-surface-variant mb-2">Resume (PDF)</label>
              <div className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer"
                onClick={() => document.getElementById('resume-input').click()}>
                <span className="material-symbols-outlined text-3xl text-outline mb-2">upload_file</span>
                <p className="text-body-sm text-on-surface-variant">
                  {resumeFile ? resumeFile.name : 'Drag PDF here or click to browse'}
                </p>
                <input id="resume-input" type="file" accept=".pdf" className="hidden" onChange={(e) => setResumeFile(e.target.files[0])} />
              </div>
            </div>
            <button type="submit" disabled={submitting} className="w-full py-3 bg-primary-container text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all">
              {submitting ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Current Profile Snapshot */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0px_1px_3px_rgba(15,23,42,0.08)] p-6">
          <h3 className="text-title-md font-semibold mb-6">Current Profile</h3>
          {student ? (
            <div className="space-y-5">
              <div className="flex justify-center mb-6">
                <StatusBadge status={student.isVerifiedByTPO ? 'Verified' : 'Pending'} />
              </div>
              {[
                ['Roll No', student.rollNo],
                ['Branch', student.branch],
                ['CGPA', student.cgpa],
                ['Backlogs', student.backlogCount],
                ['Passing Year', student.passingYear],
                ['Offer Accepted', student.hasAcceptedOffer ? 'Yes' : 'No'],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-[#E2E8F0]">
                  <span className="text-body-sm text-on-surface-variant">{label}</span>
                  <span className="text-body-md font-medium text-on-surface">{val ?? '—'}</span>
                </div>
              ))}
              {student.resumeUrl && (
                <a href={`${import.meta.env.VITE_API_BASE_URL}/${student.resumeUrl}`} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-fixed text-on-primary-fixed-variant rounded-lg text-sm font-medium hover:opacity-90 mt-4">
                  <span className="material-symbols-outlined text-sm">description</span> View Resume
                </a>
              )}
              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-body-sm text-amber-800">⚠️ Updating your profile will reset your verification status.</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2">person_add</span>
              <p className="text-body-md">No profile created yet. Fill out the form to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
