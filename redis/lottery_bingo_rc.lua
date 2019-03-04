redis.call('SELECT', 0)

local str = ''
local list = redis.call('LRANGE', 'tag:lottery_rc', 0, -1)
local matchCount = 2

for i = 1, #list do

    local no = list[i]
    local number = ''
    local keys = redis.call('HGETALL', 'lottery_rc:' .. no)
    local count = {}
    local bingo = false

    for i = 1, #keys, 2 do

        if not bingo then

        	number = keys[i + 1]

            if count[number] then
                count[number] = count[number] + 1
            else
                count[number] = 1
            end
            
            if count[number] >= matchCount then

                bingo = true

                redis.call('DEL', 'lottery_rc:' .. no)
                redis.call('LREM', 'tag:lottery_rc', 0, no)
                redis.call('LREM', 'wait_lottery_rc', 0, no)
            end
        end
    end

    if bingo then

    	if str ~= '' then str = str .. '|' end
    	str = str .. no .. '_' .. number
	end
end

if str ~= '' then return str end

