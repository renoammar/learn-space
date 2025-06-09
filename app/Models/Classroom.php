<?php
// app/Models/Classroom.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory; // Recommended to add HasFactory trait

    // teacher_id is removed from fillable as it's not in the migration
    // and creators are added to the pivot table.
    // If you have a separate 'primary teacher' concept with a teacher_id column, add it back.
    protected $fillable = ['name', 'description', 'school_id', 'code'];

    /**
     * The teachers that belong to the classroom (co-teachers and potentially creator).
     */
    public function teachers()
    {
        // Ensure 'classroom_teacher' is the correct pivot table name.
        // Ensure 'teacher_id' correctly refers to the user_id in the users table.
        return $this->belongsToMany(User::class, 'classroom_teacher', 'classroom_id', 'teacher_id');
    }

    /**
     * The students that belong to the classroom.
     */
    public function students()
    {
        // Ensure 'classroom_student' is the correct pivot table name.
        // Ensure 'student_id' correctly refers to the user_id in the users table.
        return $this->belongsToMany(User::class, 'classroom_student', 'classroom_id', 'student_id');
    }

    /**
     * The assignments for the classroom.
     */
    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    /**
     * The school that the classroom belongs to.
     */
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    // The 'teacher' relationship for a primary teacher (creator)
    // This relationship requires a 'teacher_id' foreign key column on the 'classrooms' table.
    // If you don't have this column and manage all teachers via the pivot, you can remove this.
    /*
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
    */
}
