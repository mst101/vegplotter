
alias o='terminator -l datepicker'
alias flights='bash ~/.local/share/work.sh'
#alias s='bash ~/.local/share/start_server.sh'
alias s='npm run serve'
alias d='npm run dev'
alias b='npm run build'
alias e='npm run serve:e2e'
#alias t='npm run test'
alias t='./vendor/bin/pest --compact --parallel'
alias w='npm run test:watch'
alias 2='npm run test:e2e'
alias ci='npm run test:e2e:ci'
alias h='bash ~/.local/share/start_horizon.sh'
alias a='dev app'
alias f='yarn serve'
alias c='clear'
alias a='appium -ka 7000 -p 4723 --allow-insecure=get_server_logs,chromedriver_autodownload --log-timestamp'
alias ab='appium -ka 7000 -p 4724 --allow-insecure=get_server_logs,chromedriver_autodownload --log-timestamp'

# Raspbery pi
alias pi='ssh 192.168.2.102'

# Power consumption
alias power="bash ~/.local/bin/power/consumption.sh"

# Applications
alias storm='/snap/bin/phpstorm > /dev/null 2>&1 &'
#alias phpstorm='~/Programs/PhpStorm-241.15989.102/bin/phpstorm.sh > /dev/null 2>&1 &'
#alias phpstorm='~/Programs/PhpStorm-241.15989.102/bin/phpstorm.sh'
alias idea="intellij-idea-educational > /dev/null 2>&1 &"
alias chrome="google-chrome > /dev/null 2>&1 &"
alias npp="/snap/bin/notepad-plus-plus"
alias dbeaver="dbeaver-ce > /dev/null 2>&1 &"
# Bluetooth
alias bf='bash ~/.local/bin/bluetooth/fosi.sh'
alias bh='bash ~/.local/bin/bluetooth/sesh.sh'
alias bs='sudo bluetoothctl power off'
alias pn=pnpm

# Server
alias update='sudo apt update && sudo apt upgrade'

#Docker
alias dps="docker ps"
alias drm="docker rm "
alias dirm="docker image rm "
alias dils="docker image ls"
alias dnls="docker network ls"
alias dnrm="docker network rm"
alias dvls="docker volume ls"
alias dvrm="docker volume rm"
alias dni="docker network inspect "
alias dlogs="docker logs "
alias dcstop="docker-compose stop"
alias ds="docker stop "
alias dr="docker run "
alias de="docker exec "
alias dm="docker-machine "
alias dcps="docker-compose ps"
alias dc="docker-compose "
alias dcup="docker-compose up -d nginx mysql redis"
alias dcupn="docker-compose up -d nginx"
alias dcdown="docker-compose down"
alias db="docker build -t "
alias dcbuild="docker-compose build "
alias dcbash="docker-compose exec workspace bash"
alias dcmysql="docker-compose exec mysql bash"
alias dcredis="docker-compose exec redis bash"
alias dcnginx="docker-compose exec nginx bash"

# Git
alias g="git"
alias gi="git init"
alias ga="git add"
alias gaa="git add ."
alias gb="git branch"
alias gm="git merge"
alias gmt="git mergetool"
alias gw="git switch "
alias com="git checkout main"
alias co="git checkout"
alias gc="git commit -m "
alias gcl="git clean -i"
alias gcp="git cherry-pick "
alias gl="git log"
alias glog="git log --abbrev-commit --graph --pretty='%C(bold cyan)%h%Creset - %C(white)%s%C(reset) %Cgreen(%cr) %C(reset)<%an>%C(#ff8787)%d%Creset'"
alias glog2="git log --abbrev-commit --graph --pretty='%C(bold cyan)%h%C(reset) - %C(white)%s%C(reset) %C(bold green)(%ar)%C(reset)%C(#ff8787)%d%C(reset)%n''          %C(reset)%aD% %C(reset) <%an> <%ae>'"
alias gp="git pull"
alias gu="git push"
alias gst="git stash"
alias gsa="git stash apply"
alias gsh="git show --color-words='[^[:space:]]'"
alias gsl="git stash list"
alias gt="git restore"
alias gr="git rebase"
alias grd="git reset HEAD~"
alias grh="git reset --hard"
alias grs="gi reset --soft"
alias gra="git rebase --abort"
alias grc="git rebase --continue"
alias gri="git rebase -i"
alias gs="git status"
alias gss="git status --short"
alias nah="git reset --hard;git clean -df;"
alias wip="git add . && git commit -m 'wip'"
alias gd="git diff "
alias gdf="git diff --color-words='[^[:space:]]'"
alias gdt="git difftool --color-words='[^[:space:]]'"

# Setup git autocompletion
if [ -f "/usr/share/bash-completion/completions/git" ]; then
  source /usr/share/bash-completion/completions/git
  __git_complete g __git_main
  __git_complete co _git_checkout
  __git_complete gb _git_branch
  __git_complete gcp _git_cherry_pick
  __git_complete gm _git_merge
  __git_complete gp _git_pull
  __git_complete gt _git_restore
  __git_complete gr _git_rebase
  __git_complete gu _git_push
  __git_complete gd _git_diff
else
  echo "Error loading git completions"
fi

# Vue
# alias vue="npx @vue/cli"
# alias vue="vue.cmd"
# alias vinspect="printf 'export default ' > webpack-output.config.js && vue.cmd inspect >> webpack-output.config.js"

# Servers
alias old="ssh mark@178.62.73.238"
alias live="ssh mark@159.65.62.204"

# Laravel
alias art="php artisan"
alias migrate="php artisan migrate"
alias fresh="php artisan fresh"
alias refresh="php artisan refresh"
alias sail="bash vendor/bin/sail"
alias serve="php artisan serve"
alias tinker="php artisan tinker"
alias p="php artisan test"
alias pf="php artisan test --filter"
alias pf:unit="php artisan test --filter Unit"
alias pf:feature="php artisan test --filter Feature"

function routes()
{
    if [ $# -eq 0 ]; then
        php artisan route:list
    else
        php artisan route:list | grep ${1}
    fi
}

# Nuxt
alias na="nuxi add "
alias nac="nuxi add component "
alias nacom="nuxi add composable "
alias nal="nuxi add layout "
alias nap="nuxi add page "
alias napl="nuxi add plugin "
alias nam="nuxi add middleware "
alias naa="nuxi add api "

# Composer
alias dump="composer dump-autoload"
#alias ci="composer install"
alias cu="composer update"

## Terminal Common directories
alias sa='cd /etc/nginx/sites-available'
alias se='cd /etc/nginx/sites-enabled'
alias log='cd /var/log/nginx'

function www()
{
  if [ $# -eq 0 ]; then
    cd /var/www	
  else
    cd "/var/www/${1}"
  fi
}

# Use preferred display settings when using two monitors
alias mm=/usr/share/applications/update-monitor-position.desktop

# Pest
# alias pest='./vendor/bin/sail pest'


