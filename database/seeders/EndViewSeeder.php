<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Device;
use App\Models\DeviceAgent;
use App\Models\DeviceAlert;
use App\Models\DeviceAssignment;
use App\Models\DeviceBatterySnapshot;
use App\Models\DeviceCheckin;
use App\Models\DeviceEventLog;
use App\Models\DeviceMetricSnapshot;
use App\Models\DeviceStatus;
use App\Models\DeviceStorageSnapshot;
use App\Models\EndpointUser;
use App\Models\Site;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class EndViewSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedStatuses();
        $this->removeDemoCompany();

        $company = Company::create([
            'company_code' => 'ENDVIEW-DEMO',
            'company_name' => 'EndView Demo Company',
            'is_active' => true,
        ]);

        $site = Site::create([
            'company_id' => $company->id,
            'site_code' => 'HQ-BKK',
            'site_name' => 'Bangkok HQ',
            'site_type' => 'HQ',
            'city' => 'Bangkok',
            'country' => 'Thailand',
            'is_active' => true,
        ]);

        $users = collect([
            ['username' => 'apinya.s', 'full_name' => 'Apinya S.', 'department_name' => 'Finance'],
            ['username' => 'ben.carter', 'full_name' => 'Ben Carter', 'department_name' => 'Operations'],
            ['username' => 'jintana.p', 'full_name' => 'Jintana P.', 'department_name' => 'Sales'],
            ['username' => 'marco.li', 'full_name' => 'Marco Li', 'department_name' => 'IT'],
            ['username' => 'nora.k', 'full_name' => 'Nora K.', 'department_name' => 'Support'],
        ])->map(fn(array $user) => EndpointUser::create([
                'company_id' => $company->id,
                'site_id' => $site->id,
                'username' => $user['username'],
                'full_name' => $user['full_name'],
                'email' => "{$user['username']}@endview.example",
                'department_name' => $user['department_name'],
                'role_code' => 'viewer',
                'is_active' => true,
            ]));

        $devices = [
            [
                'hostname' => 'END-LAP-001',
                'device_type' => 'Laptop',
                'status' => 'ONLINE',
                'health' => 94,
                'minutes_ago' => 1,
                'cpu' => 24,
                'ram' => 42,
                'storage' => 54,
                'battery' => 83,
                'battery_health' => 95,
                'model' => 'Latitude 7440',
                'user_index' => 0,
            ],
            [
                'hostname' => 'END-LAP-002',
                'device_type' => 'Laptop',
                'status' => 'ONLINE',
                'health' => 88,
                'minutes_ago' => 2,
                'cpu' => 33,
                'ram' => 51,
                'storage' => 63,
                'battery' => 67,
                'battery_health' => 88,
                'model' => 'ThinkPad T14',
                'user_index' => 1,
            ],
            [
                'hostname' => 'END-WS-003',
                'device_type' => 'Workstation',
                'status' => 'WARNING',
                'health' => 72,
                'minutes_ago' => 4,
                'cpu' => 61,
                'ram' => 78,
                'storage' => 76,
                'battery' => null,
                'battery_health' => null,
                'model' => 'Precision 3660',
                'user_index' => 3,
            ],
            [
                'hostname' => 'END-LAP-004',
                'device_type' => 'Laptop',
                'status' => 'CRITICAL',
                'health' => 38,
                'minutes_ago' => 8,
                'cpu' => 92,
                'ram' => 89,
                'storage' => 94,
                'battery' => 19,
                'battery_health' => 54,
                'model' => 'EliteBook 840',
                'user_index' => 2,
            ],
            [
                'hostname' => 'END-WS-005',
                'device_type' => 'Desktop',
                'status' => 'OFFLINE',
                'health' => 58,
                'minutes_ago' => 37,
                'cpu' => 45,
                'ram' => 69,
                'storage' => 81,
                'battery' => null,
                'battery_health' => null,
                'model' => 'OptiPlex 7010',
                'user_index' => 4,
            ],
            [
                'hostname' => 'END-LAP-006',
                'device_type' => 'Laptop',
                'status' => 'OFFLINE',
                'health' => 64,
                'minutes_ago' => 130,
                'cpu' => 39,
                'ram' => 56,
                'storage' => 71,
                'battery' => 42,
                'battery_health' => 72,
                'model' => 'Surface Laptop 6',
                'user_index' => 1,
            ],
            [
                'hostname' => 'END-WS-007',
                'device_type' => 'Workstation',
                'status' => 'ONLINE',
                'health' => 91,
                'minutes_ago' => 1,
                'cpu' => 29,
                'ram' => 48,
                'storage' => 58,
                'battery' => null,
                'battery_health' => null,
                'model' => 'Z2 Tower G9',
                'user_index' => 3,
            ],
            [
                'hostname' => 'END-LAP-008',
                'device_type' => 'Laptop',
                'status' => 'WARNING',
                'health' => 69,
                'minutes_ago' => 11,
                'cpu' => 57,
                'ram' => 66,
                'storage' => 86,
                'battery' => 31,
                'battery_health' => 67,
                'model' => 'MacBook Pro 14',
                'user_index' => 0,
            ],
            [
                'hostname' => 'END-KIOSK-009',
                'device_type' => 'Kiosk',
                'status' => 'CRITICAL',
                'health' => 42,
                'minutes_ago' => 82,
                'cpu' => 81,
                'ram' => 84,
                'storage' => 91,
                'battery' => null,
                'battery_health' => null,
                'model' => 'Intel NUC 13',
                'user_index' => 4,
            ],
            [
                'hostname' => 'END-LAP-010',
                'device_type' => 'Laptop',
                'status' => 'ONLINE',
                'health' => 96,
                'minutes_ago' => 3,
                'cpu' => 18,
                'ram' => 36,
                'storage' => 49,
                'battery' => 91,
                'battery_health' => 98,
                'model' => 'Latitude 5450',
                'user_index' => 2,
            ],
        ];

        foreach ($devices as $index => $data) {
            $this->seedDevice($company, $site, $users[$data['user_index']], $index + 1, $data);
        }
    }

    private function seedStatuses(): void
    {
        foreach ([
            ['ONLINE', 'Online', 1],
            ['OFFLINE', 'Offline', 2],
            ['WARNING', 'Warning', 3],
            ['CRITICAL', 'Critical', 4],
            ['INACTIVE', 'Inactive', 5],
        ] as [$code, $name, $rank]) {
            DeviceStatus::updateOrCreate(
                ['status_code' => $code],
                [
                    'status_name' => $name,
                    'sort_order' => $rank,
                    'is_active' => true,
                ]
            );
        }
    }

    private function removeDemoCompany(): void
    {
        $company = Company::query()->where('company_code', 'ENDVIEW-DEMO')->first();

        if (!$company) {
            return;
        }

        $deviceIds = Device::query()
            ->where('company_id', $company->id)
            ->pluck('id');

        if ($deviceIds->isNotEmpty()) {
            Device::query()->whereIn('id', $deviceIds)->delete();
        }

        EndpointUser::query()->where('company_id', $company->id)->delete();
        Site::query()->where('company_id', $company->id)->delete();
        $company->delete();
    }

    private function seedDevice(Company $company, Site $site, EndpointUser $user, int $number, array $data): void
    {
        $now = Carbon::now();
        $lastCheckinAt = $now->copy()->subMinutes($data['minutes_ago']);
        $serial = 'EV' . str_pad((string) $number, 6, '0', STR_PAD_LEFT);
        $macSuffix = str_pad(dechex($number), 2, '0', STR_PAD_LEFT);
        $osName = $data['hostname'] === 'END-LAP-008' ? 'macOS' : 'Windows 11 Pro';

        $device = Device::create([
            'company_id' => $company->id,
            'site_id' => $site->id,
            'current_user_id' => $user->id,
            'device_uuid' => (string) Str::uuid(),
            'agent_key' => "seed-agent-key-{$number}",
            'device_name' => $data['hostname'],
            'hostname' => $data['hostname'],
            'fqdn' => strtolower($data['hostname']) . '.corp.endview.local',
            'device_type' => $data['device_type'],
            'os_name' => $osName,
            'os_version' => $osName === 'macOS' ? '15.2' : '23H2',
            'os_build' => $osName === 'macOS' ? '24C101' : '22631.4317',
            'os_architecture' => 'x64',
            'manufacturer' => $osName === 'macOS' ? 'Apple Inc.' : ($number % 2 === 0 ? 'HP' : 'Dell Inc.'),
            'model' => $data['model'],
            'serial_number' => $serial,
            'bios_version' => '1.' . ($number + 3) . '.0',
            'cpu_name' => $number % 3 === 0 ? 'Intel Core i7-13700' : 'Intel Core i5-1345U',
            'cpu_physical_cores' => $number % 3 === 0 ? 8 : 4,
            'cpu_logical_cores' => $number % 3 === 0 ? 16 : 8,
            'total_memory_mb' => $number % 3 === 0 ? 32768 : 16384,
            'mac_address' => "02:42:ac:11:00:{$macSuffix}",
            'ipv4_address' => '10.24.12.' . (40 + $number),
            'ipv6_address' => "fe80::242:acff:fe11:{$macSuffix}",
            'last_logged_on_username' => $user->username,
            'last_logon_at' => $lastCheckinAt->copy()->subMinutes(12),
            'enrolled_at' => $now->copy()->subDays(30 + $number),
            'last_checkin_at' => $lastCheckinAt,
            'last_inventory_at' => $lastCheckinAt->copy()->subMinutes(10),
            'last_metrics_at' => $lastCheckinAt->copy()->subMinutes(2),
            'current_status_code' => $data['status'],
            'health_score' => $data['health'],
            'is_enabled' => true,
            'is_deleted' => false,
        ]);

        DeviceAgent::create([
            'device_id' => $device->id,
            'agent_version' => '1.0.' . ($number + 3),
            'api_token_hash' => hash('sha256', (string) $device->agent_key),
            'token_issued_at' => $device->enrolled_at,
            'last_seen_ip' => $device->ipv4_address,
            'last_seen_user_agent' => 'EndView Seeder',
            'is_active' => $data['status'] !== 'OFFLINE',
        ]);

        DeviceAssignment::create([
            'device_id' => $device->id,
            'user_id' => $user->id,
            'assigned_at' => $now->copy()->subDays(28 + $number),
            'assignment_notes' => 'Initial EndView enrollment assignment',
        ]);

        for ($i = 4; $i >= 0; $i--) {
            DeviceCheckin::create([
                'device_id' => $device->id,
                'checked_in_at' => $lastCheckinAt->copy()->subMinutes($i * 5),
                'status_code' => $data['status'] === 'OFFLINE' && $i === 0 ? 'OFFLINE' : 'ONLINE',
                'agent_version' => '1.0.' . ($number + 3),
                'current_user_name' => $user->full_name,
                'ip_address' => $device->ipv4_address,
                'mac_address' => $device->mac_address,
                'uptime_seconds' => (12 - $i) * 3600,
                'remarks' => $data['status'] === 'OFFLINE' && $i === 0 ? 'No subsequent heartbeat received' : 'Heartbeat accepted',
            ]);
        }

        $latestMetric = null;

        for ($hour = 11; $hour >= 0; $hour--) {
            $capturedAt = $lastCheckinAt->copy()->subHours($hour);
            $cpu = $this->boundedPercent($data['cpu'] + (($hour % 4) - 1) * 4);
            $ram = $this->boundedPercent($data['ram'] + (($hour % 5) - 2) * 3);
            $storage = $this->boundedPercent($data['storage'] - ($hour * 0.4));
            $battery = $data['battery'] === null ? null : $this->boundedPercent($data['battery'] + ($hour * 1.2));
            $batteryHealth = $data['battery_health'];
            $ramTotal = $device->total_memory_mb ?? 16384;
            $storageTotal = $number % 2 === 0 ? 512 : 1024;

            $latestMetric = DeviceMetricSnapshot::create([
                'device_id' => $device->id,
                'captured_at' => $capturedAt,
                'cpu_usage_percent' => $cpu,
                'cpu_temperature_c' => $cpu > 80 ? 87.5 : 52 + ($number % 7),
                'cpu_health_percent' => $cpu > 85 ? 68 : 92,
                'ram_total_mb' => $ramTotal,
                'ram_used_mb' => (int) round($ramTotal * ($ram / 100)),
                'ram_free_mb' => (int) round($ramTotal * ((100 - $ram) / 100)),
                'ram_usage_percent' => $ram,
                'total_storage_gb' => $storageTotal,
                'used_storage_gb' => round($storageTotal * ($storage / 100), 2),
                'free_storage_gb' => round($storageTotal * ((100 - $storage) / 100), 2),
                'storage_usage_percent' => $storage,
                'battery_percent' => $battery,
                'battery_health_percent' => $batteryHealth,
                'battery_cycle_count' => $battery === null ? null : 160 + ($number * 24),
                'is_charging' => $battery === null ? null : $number % 2 === 0,
                'is_online' => $data['status'] !== 'OFFLINE',
                'health_score' => $data['health'],
            ]);
        }

        if ($latestMetric) {
            if ($data['battery'] !== null) {
                DeviceBatterySnapshot::create([
                    'device_id' => $device->id,
                    'captured_at' => $latestMetric->captured_at,
                    'battery_percent' => $latestMetric->battery_percent,
                    'battery_health_percent' => $latestMetric->battery_health_percent,
                    'battery_cycle_count' => $latestMetric->battery_cycle_count,
                    'battery_status' => $latestMetric->is_charging ? 'Charging' : 'Discharging',
                    'is_charging' => $latestMetric->is_charging,
                    'battery_design_capacity_mwh' => 54000,
                    'battery_full_charge_capacity_mwh' => (int) round(54000 * (($data['battery_health'] ?? 100) / 100)),
                ]);
            }

            $this->seedStorage($device, $latestMetric, $data['storage'], $number);
            $this->seedAlerts($device, $latestMetric, $data);
        }

        $this->seedEvents($device, $data, $lastCheckinAt);
    }

    private function seedStorage(Device $device, DeviceMetricSnapshot $latestMetric, float $storageUsage, int $number): void
    {
        $systemTotal = $number % 2 === 0 ? 512 : 1024;
        $dataTotal = 512;
        $dataUsage = $this->boundedPercent($storageUsage - 14);

        DeviceStorageSnapshot::create([
            'device_id' => $device->id,
            'metric_snapshot_id' => $latestMetric->id,
            'drive_name' => 'C:',
            'drive_label' => 'System',
            'file_system' => 'NTFS',
            'total_gb' => $systemTotal,
            'used_gb' => round($systemTotal * ($storageUsage / 100), 2),
            'free_gb' => round($systemTotal * ((100 - $storageUsage) / 100), 2),
            'used_percent' => $storageUsage,
        ]);

        DeviceStorageSnapshot::create([
            'device_id' => $device->id,
            'metric_snapshot_id' => $latestMetric->id,
            'drive_name' => 'D:',
            'drive_label' => 'Data',
            'file_system' => 'NTFS',
            'total_gb' => $dataTotal,
            'used_gb' => round($dataTotal * ($dataUsage / 100), 2),
            'free_gb' => round($dataTotal * ((100 - $dataUsage) / 100), 2),
            'used_percent' => $dataUsage,
        ]);
    }

    private function seedAlerts(Device $device, DeviceMetricSnapshot $latestMetric, array $data): void
    {
        if ($data['storage'] >= 85) {
            DeviceAlert::create([
                'device_id' => $device->id,
                'metric_snapshot_id' => $latestMetric->id,
                'alert_code' => 'STORAGE_HIGH',
                'alert_name' => 'Storage usage high',
                'severity_code' => $data['storage'] >= 92 ? 'CRITICAL' : 'WARNING',
                'alert_message' => "System drive usage reached {$data['storage']}%.",
                'opened_at' => $latestMetric->captured_at->copy()->subMinutes(2),
                'status_code' => $data['status'] === 'CRITICAL' ? 'OPEN' : 'ACK',
                'acknowledged_at' => $data['status'] === 'CRITICAL' ? null : $latestMetric->captured_at,
            ]);
        }

        if (($data['battery_health'] ?? 100) < 75) {
            DeviceAlert::create([
                'device_id' => $device->id,
                'metric_snapshot_id' => $latestMetric->id,
                'alert_code' => 'BATTERY_HEALTH_LOW',
                'alert_name' => 'Battery health low',
                'severity_code' => $data['battery_health'] < 60 ? 'CRITICAL' : 'WARNING',
                'alert_message' => "Battery health is {$data['battery_health']}%.",
                'opened_at' => $latestMetric->captured_at->copy()->subMinutes(4),
                'status_code' => 'OPEN',
            ]);
        }

        if ($data['cpu'] >= 80) {
            DeviceAlert::create([
                'device_id' => $device->id,
                'metric_snapshot_id' => $latestMetric->id,
                'alert_code' => 'CPU_SUSTAINED_HIGH',
                'alert_name' => 'CPU sustained high',
                'severity_code' => 'CRITICAL',
                'alert_message' => "CPU usage is sustained around {$data['cpu']}%.",
                'opened_at' => $latestMetric->captured_at->copy()->subMinutes(6),
                'status_code' => 'OPEN',
            ]);
        }

        if ($data['status'] === 'OFFLINE') {
            DeviceAlert::create([
                'device_id' => $device->id,
                'metric_snapshot_id' => $latestMetric->id,
                'alert_code' => 'CHECKIN_MISSED',
                'alert_name' => 'Device missed check-in',
                'severity_code' => 'WARNING',
                'alert_message' => 'Device did not check in inside the expected heartbeat window.',
                'opened_at' => $device->last_checkin_at->copy()->addMinutes(15),
                'status_code' => $device->last_checkin_at->lt(now()->subHour()) ? 'OPEN' : 'ACK',
                'acknowledged_at' => $device->last_checkin_at->lt(now()->subHour()) ? null : $device->last_checkin_at->copy()->addMinutes(22),
            ]);
        }

        if ($data['status'] === 'ONLINE' && $data['health'] > 90) {
            DeviceAlert::create([
                'device_id' => $device->id,
                'metric_snapshot_id' => $latestMetric->id,
                'alert_code' => 'PATCH_RESTART_PENDING',
                'alert_name' => 'Patch restart pending',
                'severity_code' => 'INFO',
                'alert_message' => 'A Windows update restart was detected and later cleared.',
                'opened_at' => now()->subDays(2),
                'acknowledged_at' => now()->subDays(2)->addMinutes(30),
                'resolved_at' => now()->subDay(),
                'status_code' => 'RESOLVED',
            ]);
        }
    }

    private function seedEvents(Device $device, array $data, Carbon $lastCheckinAt): void
    {
        $events = [
            [
                'event_type' => 'DEVICE_REGISTERED',
                'event_source' => 'SEEDER',
                'event_message' => "{$device->hostname} enrolled with EndView.",
                'event_at' => $device->enrolled_at,
            ],
            [
                'event_type' => 'INVENTORY_UPDATED',
                'event_source' => 'SEEDER',
                'event_message' => 'Hardware and OS inventory was refreshed.',
                'event_at' => $device->last_inventory_at,
            ],
            [
                'event_type' => 'CHECKIN_RECEIVED',
                'event_source' => 'SEEDER',
                'event_message' => 'Agent heartbeat was processed.',
                'event_at' => $lastCheckinAt,
            ],
        ];

        if (in_array($data['status'], ['WARNING', 'CRITICAL', 'OFFLINE'], true)) {
            $events[] = [
                'event_type' => $data['status'] === 'OFFLINE' ? 'DEVICE_OFFLINE' : 'ALERT_OPENED',
                'event_source' => 'SEEDER',
                'event_message' => $data['status'] === 'OFFLINE'
                    ? 'Device exceeded the check-in threshold.'
                    : 'Health telemetry crossed an alert threshold.',
                'event_at' => $lastCheckinAt->copy()->addMinutes(3),
            ];
        }

        foreach ($events as $event) {
            DeviceEventLog::create([
                'device_id' => $device->id,
                ...$event,
            ]);
        }
    }

    private function boundedPercent(float $value): float
    {
        return round(min(99, max(1, $value)), 2);
    }
}
