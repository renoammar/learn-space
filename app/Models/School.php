<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'principal_id'];

    public function principal()
    {
        return $this->belongsTo(User::class, 'principal_id');
    }

    public function classrooms()
    {
        return $this->hasMany(Classroom::class);
    }
    
    /**
     * Get all members (users) belonging to the school.
     */
    public function members()
    {
        return $this->hasMany(User::class);
    }
}