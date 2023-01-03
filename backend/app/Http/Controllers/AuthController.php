<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected function loginValidator(array $data)
    {
        return Validator::make($data, [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:6',
        ]);
    }
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        $validator = $this->loginValidator($credentials);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'message' => 'Email hoặc mật khẩu không hợp lệ'
            ]);
        }

        $user = User::where('email', request('email'))->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản không tồn tại'
            ]);
        }
        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' =>
                    'Tài khoản của bạn đã bị khóa bởi quản trị viên do có hành vi bất thường'
            ]);
        }

        if (!$token = auth()->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc mật khẩu không chính xác'
            ]);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Register new User
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register()
    {
        $newUser = [
            'display_name' => request('fullName'),
            'email' => request('email'),
            'password' => Hash::make(request('password'))
        ];

        try {
            // $user = User::create($newUser);
            DB::table('users')->insert($newUser);
            return response()->json(['success' => 'Registered successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Registration error']);
        }
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out'
        ]);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'success' => true,
            'token' => [
                'access_token' => $token,
                'expires_in' => auth()->factory()->getTTL() * 60
            ],
            'user' => auth()->user()]);
    }
}
