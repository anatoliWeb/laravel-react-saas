<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add role column to users table.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            // Avoid duplicate column error if migration runs twice
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role')
                    ->default('user')
                    ->after('email'); // or after any suitable column
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * Remove role column safely.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            // Avoid error if column already removed
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
        });
    }
};