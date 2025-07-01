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
    Schema::table('assignment_submissions', function (Blueprint $table) {
        $table->string('status')->default('submitted')->after('content'); // e.g., submitted, reviewed, completed
    });
}

public function down(): void
{
    Schema::table('assignment_submissions', function (Blueprint $table) {
        $table->dropColumn('status');
    });
}
};
