redis.call('SELECT', 0)

local str = ''
local list = redis.call('LRANGE', 'wait_lottery_sy', 0, -1)

for i, no in pairs(list) do

	if str ~= '' then str = str .. '|' end
    str = str .. no
end

if str ~= '' then return str end