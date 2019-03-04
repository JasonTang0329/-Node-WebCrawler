redis.call('SELECT', 0)

local name = ARGV[1]
local no = ARGV[2]
local number = ARGV[3]

redis.call('HSET', 'lottery_sy:' .. no, name, number)
redis.call('LREM', 'tag:lottery_sy', 0, no)
redis.call('RPUSH', 'tag:lottery_sy', no)