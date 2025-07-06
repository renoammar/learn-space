<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'school_id'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    // In app/Models/User.php, add this method to the class

    public function submissions()
        {
    return $this->hasMany(AssignmentSubmission::class, 'student_id');
    }
    // A user belongs to a school
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function classrooms()
    {
        return $this->belongsToMany(Classroom::class, 'classroom_teacher', 'teacher_id', 'classroom_id');
    }

    public function assignedClassrooms()
    {
        return $this->belongsToMany(Classroom::class, 'classroom_teacher', 'teacher_id', 'classroom_id');
    }

    public function enrolledClassrooms()
    {
        return $this->belongsToMany(Classroom::class, 'classroom_student', 'student_id', 'classroom_id');
    }
}