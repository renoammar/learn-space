<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schedule_events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type'); // e.g., 'exam', 'holiday', 'deadline', 'event'
            $table->timestamp('start_date');
            $table->timestamp('end_date')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Who created the event
            $table->foreignId('school_id')->constrained()->onDelete('cascade'); // Associated School
            $table->foreignId('classroom_id')->nullable()->constrained()->onDelete('cascade'); // Optional classroom association
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedule_events');
    }
};