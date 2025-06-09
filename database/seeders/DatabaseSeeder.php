<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Buat akun kepala sekolah
        User::create([
            'name' => 'Kepala Sekolah',
            'email' => 'kepsek@gmail.com',
            'password' => Hash::make('kucing123'),
            'role' => 'principal',
        ]);

        // Buat akun guru
        User::create([
            'name' => 'Guru',
            'email' => 'guru@gmail.com',
            'password' => Hash::make('kucing123'),
            'role' => 'teacher',
        ]);

        // Buat akun murid
        User::create([
            'name' => 'Murid',
            'email' => 'murid@gmail.com',
            'password' => Hash::make('kucing123'),
            'role' => 'student',
        ]);
    }
}
